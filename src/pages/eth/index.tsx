import { ConnectKitButton } from 'connectkit'
import EthLayout from '../../components/EthLayout'
import { useAccount, useEnsName } from 'wagmi'
import { useMemoizedFn } from 'ahooks'
import { notify } from '../../utils/notifications'

// // Make sure that this component is wrapped with ConnectKitProvider
// const MyComponent = () => {
//   const { address, isConnecting, isDisconnected } = useAccount();
//   if (isConnecting) return <div>Connecting...</div>;
//   if (isDisconnected) return <div>Disconnected</div>;
//   return <div>Connected Wallet: {address}</div>;
// };

export default function Home() {
  const { address} = useAccount()

  const getMiro = useMemoizedFn(async () => {
    if (!address) {
      notify({ type: 'error', message: `请先连接钱包!` })
    }

    const res = await fetch('/api/eth/getMiro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, miroNum: 2 }),
    })
    console.log(res)
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
              <div className="stat-value">12</div>
            </div>
            <div className="stat">
              <div className="stat-title">你的排名</div>
              <div className="stat-value"># 1</div>
            </div>
            <div className="stat">
              <div className="stat-title">miro 数量</div>
              <div className="stat-value">31000</div>
            </div>
            <div className="stat">
              <div className="stat-title">eth 数量</div>
              <div className="stat-value">0.0001</div>
            </div>
          </div>
          <div className="text-gray-900 mt-4">
            <span className="w-1/2">领取水龙头：</span>
            <button className="btn btn-neutral">test</button>
          </div>
          <div className="text-gray-900 mt-4">
            <span className="w-1/2">获取miro：</span>
            <button className="btn btn-neutral" onClick={getMiro}>
              2 miro
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
