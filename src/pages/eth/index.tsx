import { ConnectKitButton } from 'connectkit'
import EthLayout from '../../components/EthLayout'
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
  }, [address, getUserInfo])

  const getMiro = useMemoizedFn(async () => {
    if (!address) {
      notify({ type: 'error', message: `请先连接钱包!` })
      setGetBtnLoading(false)
    }
    if (!!getBtnLoading) return

    setGetBtnLoading(true)
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
            <span className="w-1/2">领取水龙头：</span>
            <button className="btn btn-neutral">test</button>
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
