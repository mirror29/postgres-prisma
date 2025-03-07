// Next, React
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop'
import { SwapMiro } from '../../components/SwapMiro'
import pkg from '../../../package.json'

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore'

export const HomeView: FC = ({}) => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const balance = useUserSOLBalanceStore(s => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <div className="text-sm font-normal align-bottom text-right text-slate-600 mt-4">
            v{pkg.version}
          </div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            postgres-prisma
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>用Next.js14+Prisma+PostgreSQL+Rust的全栈Solana web3项目demo</p>
          <p className="text-slate-500 text-2x1 leading-relaxed">Full-stack Solana applications.</p>
        </h4>
        <ul className="steps">
          <li
            className={classNames('step', activeTab === 0 && 'step-info')}
            onClick={() => setActiveTab(0)}
          >
            水龙头获取
          </li>
          <li
            className={classNames('step', activeTab === 1 && 'step-info')}
            onClick={() => setActiveTab(1)}
          >
            Miro代币swap
          </li>
          {/* <li className="step">合约交易信息</li> */}
          {/* <li className="step">MIRR用户地址</li> */}
        </ul>

        <div className="flex flex-col mt-2">
          {activeTab === 0 && (
            <>
              <RequestAirdrop />
              <h4 className="md:w-full text-2xl text-slate-300 my-2">
                {wallet && (
                  <div className="flex flex-row justify-center">
                    <div>{(balance || 0).toLocaleString()}</div>
                    <div className="text-slate-600 ml-2">SOL</div>
                  </div>
                )}
              </h4>
            </>
          )}
          {activeTab === 1 && (
            <>
              <SwapMiro />
              <h4 className="md:w-full text-2xl text-slate-300 my-2">
                {wallet && (
                  <div className="flex flex-row justify-center">
                    <div>{(balance || 0).toLocaleString()}</div>
                    <div className="text-slate-600 ml-2">Miro</div>
                  </div>
                )}
              </h4>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
