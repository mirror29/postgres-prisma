import { ConnectKitButton } from 'connectkit'
import EthLayout from '../../components/EthLayout'
import Web3 from 'web3'
import { getMiroTokenContract } from '../../lib/contracts/MiroToken'
import { useAccount, useBalance } from 'wagmi'
import { useMemoizedFn } from 'ahooks'
import { notify } from '../../utils/notifications'
import { useState, useLayoutEffect } from 'react'

export default function Home() {
  const { address } = useAccount()
  const { data: balance, isLoading } = useBalance({
    address,
  })
  const [getBtnLoading, setGetBtnLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    totalUser: 0,
    rank: 0,
    miroNum: 0,
    ethNum: 0,
  })
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [userClaims, setUserClaims] = useState(0)

  const getUserInfo = useMemoizedFn(async () => {
    if (!address) return

    const response = await fetch('/api/eth/getUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })
    const data = await response.json()

    const { miroNum, rank, totalUser } = data
    setUserInfo({
      ...userInfo,
      miroNum,
      rank,
      totalUser,
    })
  })

  useLayoutEffect(() => {
    if (!address) return
    getUserInfo()

    const connectToMetamask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const web3Instance = new Web3(window.ethereum)
        const accounts = await web3Instance.eth.getAccounts()
        setWeb3(web3Instance)
      } else {
        notify({ type: 'error', message: 'Metamask not detected' })
      }
    }

    connectToMetamask()
  }, [address, getUserInfo])

  const getMiro = useMemoizedFn(async () => {
    if (!address) {
      notify({ type: 'error', message: `请先连接钱包!` })
      setGetBtnLoading(false)
    }
    if (!!getBtnLoading) return

    setGetBtnLoading(true)

    try {
      const contract = getMiroTokenContract(web3)
      const claimMethod = contract.methods.claim()
      const gas = await claimMethod.estimateGas({ from: address })
      const tx = await claimMethod.send({ from: address, gas })

      const userClaims = await contract.methods.userClaims(address).call()
      setUserClaims(parseInt(userClaims))
    } catch (error) {
      if (error instanceof Error) {
        notify({ type: 'error', message: error.message })
      } else {
        notify({ type: 'error', message: 'An unknown error occurred' })
      }
    }

    const response = await fetch('/api/eth/getMiro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, miroNum: 2 }),
    })
    const data = await response.json()

    if (data?.code === -1) {
      notify({ type: 'error', message: data.msg })
    } else {
      setUserInfo({
        ...userInfo,
        miroNum: data.miroNum,
      })
    }

    setGetBtnLoading(false)
  })

  return (
    <div className="h-screen">
      <div className="flex items-center justify-end p-5">
        <ConnectKitButton />
      </div>
      <div className="flex m-6 justify-center">
        <div className="rounded-lg bg-white shadow-lg p-4 w-3/4 ml-4 justify-center flex-row">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">总用户数</div>
              <div className="stat-value">{userInfo.totalUser}</div>
            </div>
            <div className="stat">
              <div className="stat-title">你的排名</div>
              <div className="stat-value"># {userInfo.rank}</div>
            </div>
            <div className="stat">
              <div className="stat-title">miro 数量</div>
              <div className="stat-value">{userInfo.miroNum}</div>
            </div>
            <div className="stat">
              <div className="stat-title">eth 数量</div>
              <div className="stat-value">
                {balance?.formatted ? (+balance?.formatted)?.toFixed(6) : 0.0}
              </div>
            </div>
          </div>
          <div className="text-gray-900 mt-4">
            <span className="w-1/2">水龙头获取：</span>
            <a
              href="https://www.alchemy.com/faucets/ethereum-sepolia"
              className="btn btn-neutral"
              target="_blank"
            >
              sepolia
            </a>
          </div>
          <div className="text-gray-900 mt-4">
            <span className="w-1/2">获取miro：</span>
            <button className="btn btn-neutral" onClick={getMiro}>
              {getBtnLoading && <span className="loading loading-spinner"></span>}2 miro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return <EthLayout>{page}</EthLayout>
}
