import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

interface ResponseData {
  message?: string
  transactionHash?: string
  userClaims?: number
  error?: string
}

/** 领取miro */
export default async function getMiro(req: NextApiRequest, res: NextApiResponse) {
  const { address, miroNum } = req.body
  if (!address) {
    return res.status(400).json({ error: 'Wallet address and signed data are required' })
  }

  if (req.method === 'POST') {
    try {
      // 先查找用户是否存在
      const existingRecord = await prisma.miro_eth.findUnique({
        where: {
          walletAddress: address,
        },
      })

      if (!existingRecord) {
        // 不存在则新增
        await prisma.miro_eth.create({
          data: {
            walletAddress: address,
            miroNum,
            lastTime: new Date(),
          },
        })
        res.status(200).json({ walletAddress: address, miroNum })
      } else {
        // 检查当前时间是否与 lastTime 在同一天
        const currentDate = new Date().toISOString().slice(0, 10)
        const lastTime = existingRecord.lastTime?.toISOString().slice(0, 10)

        if (currentDate > lastTime) {

          // 更新数据库，如果当前时间大于 lastTime , 则更新 miroNum 字段
          const miroNum = existingRecord.miroNum + 2
          await prisma.miro_eth.update({
            where: {
              walletAddress: address,
            },
            data: {
              miroNum,
              lastTime: new Date(),
            },
          })
          res.status(200).json({ ...existingRecord, miroNum })
        } else {
          res.status(200).json({ code: -1, msg: '今天已经领取过，明天再来吧！' })
        }
      }
    } catch (error) {
      // console.error(`Error upserting miro_eth record: ${error}`)
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unknown error occurred' })
      }
    } finally {
      await prisma.$disconnect()
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
