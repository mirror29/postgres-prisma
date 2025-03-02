import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js'
import { FC, useCallback, useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { notify } from '../utils/notifications'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import { Program, Provider, AnchorError } from '@project-serum/anchor'
import { Buffer } from 'buffer'

import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore'

// Polyfill for browser
window.Buffer = Buffer

// IDL 类型定义
type MiroProgram = {
  publicKey: PublicKey
  methods: {
    claimTokens(): any
  }
  account: {
    userState: any
  }
}

export const SwapMiro: FC = () => {
  const { connection } = useConnection()
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  const { wallet, publicKey, signTransaction } = useWallet()
  const [isClaiming, setIsClaiming] = useState(false)
  // const [program, setProgram] = useState<Program<MiroProgram> | null>(null)
  const [mintPublicKey] = useState(new PublicKey('YOUR_MINT_PUBKEY_HERE'))
  const [programId] = useState(new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'))

  // 初始化 Anchor 程序
  // useEffect(() => {
  //   if (!wallet || !publicKey) return

  //   const provider = new Provider(connection, wallet.adapter as any, Provider.defaultOptions())

  //   const loadProgram = async () => {
  //     const idl = await Program.fetchIdl(programId, provider)
  //     if (!idl) throw new Error('IDL not found')
  //     setProgram(new Program(idl, programId, provider))
  //   }

  //   loadProgram()
  // }, [wallet, publicKey, connection, programId])

  // // 创建关联代币账户
  // const createTokenAccount = useCallback(async () => {
  //   if (!publicKey || !signTransaction || !program) return

  //   const userTokenAccount = await getAssociatedTokenAddress(mintPublicKey, publicKey)

  //   const accountInfo = await connection.getAccountInfo(userTokenAccount)
  //   if (accountInfo) return

  //   const createATAInstruction = createAssociatedTokenAccountInstruction(
  //     publicKey,
  //     userTokenAccount,
  //     publicKey,
  //     mintPublicKey
  //   )

  //   const tx = new Transaction().add(createATAInstruction)
  //   tx.feePayer = publicKey
  //   tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash

  //   const signedTx = await signTransaction(tx)
  //   const txId = await connection.sendRawTransaction(signedTx.serialize())
  //   await connection.confirmTransaction(txId)
  // }, [publicKey, signTransaction, connection, mintPublicKey, program])

  // // 执行领取操作
  // const handleClaim = useCallback(async () => {
  //   if (!publicKey || !program) {
  //     // toast.error('请先连接钱包')
  //     return
  //   }

  //   setIsClaiming(true)
  //   try {
  //     // 1. 创建关联账户（如果需要）
  //     await createTokenAccount()

  //     // 2. 生成PDA地址
  //     const [userStatePDA] = PublicKey.findProgramAddressSync(
  //       [Buffer.from('user-state'), publicKey.toBuffer()],
  //       program.programId
  //     )

  //     // 3. 获取用户代币账户
  //     const userTokenAccount = await getAssociatedTokenAddress(mintPublicKey, publicKey)

  //     // 4. 发送交易
  //     const txId = await program.methods
  //       .claimTokens()
  //       .accounts({
  //         userState: userStatePDA,
  //         user: publicKey,
  //         userTokenAccount,
  //         mint: mintPublicKey,
  //         mintAuthority: PublicKey.findProgramAddressSync(
  //           [Buffer.from('mint-auth')],
  //           program.programId
  //         )[0],
  //         systemProgram: PublicKey.default,
  //         tokenProgram: program.programId,
  //         rent: PublicKey.default,
  //       })
  //       .rpc()

  //     // toast.success(
  //     //   <a
  //     //     href={`https://explorer.solana.com/tx/${txId}?cluster=testnet`}
  //     //     target="_blank"
  //     //     rel="noopener noreferrer"
  //     //   >
  //     //     领取成功！查看交易
  //     //   </a>
  //     // )
  //   } catch (error) {
  //     if (error instanceof AnchorError) {
  //       // toast.error(`错误: ${error.error.errorCode.code}`)
  //     } else {
  //       // toast.error(`领取失败: ${(error as Error).message}`)
  //     }
  //   } finally {
  //     setIsClaiming(false)
  //   }
  // }, [publicKey, program, mintPublicKey, createTokenAccount])

  const onClick = useMemoizedFn(async () => {
    if (!publicKey) {
      console.log('error', 'Wallet not connected!')
      notify({
        type: 'error',
        message: 'error',
        description: 'Wallet not connected!',
      })
      return
    }

    let signature: TransactionSignature = ''

    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)

      // Get the lates block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

      notify({
        type: 'success',
        message: 'Airdrop successful!',
        txid: signature,
      })

      getUserSOLBalance(publicKey, connection)
    } catch (error: any) {
      notify({
        type: 'error',
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      })
      console.log('error', `Airdrop failed! ${error?.message}`, signature)
    }
  })

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>

        <button
          className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={onClick}
        >
          <span>SwapMiro 2 </span>
        </button>
      </div>
    </div>
  )
}
