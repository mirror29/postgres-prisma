import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

/** 领取miro */
export default async function getMiro(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.address) {
    throw new Error('address is required')
  }

  if (req.method === 'POST') {
    const { address, miroNum } = req.body
    try {
      // 先查找是否存在
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
          // 如果当前时间大于 lastTime , 则更新 miroNum 字段
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
      console.error(`Error upserting miro_eth record: ${error}`)
    } finally {
      await prisma.$disconnect()
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
