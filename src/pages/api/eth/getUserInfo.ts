import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

/** 获取用户信息 */
export default async function getUserInfo(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.address) {
    throw new Error('address is required')
  }

  if (req.method === 'POST') {
    try {
      const { address } = req.body
      // 查找 miro_eth 表中所有记录,并按 miroNum 字段降序排列
      const records = await prisma.miro_eth.findMany({
        orderBy: {
          miroNum: 'desc',
        },
      })
      // 找到当前用户在排名中的位置
      const rank = records.findIndex(record => record.walletAddress === address) + 1
      // 根据排名找到当前用户的记录
      const currentUserRecord = records.find(record => record.walletAddress === address)
      // 所有用户数量
      const totalUser = await prisma.miro_eth.count()

      res.status(200).json({ ...currentUserRecord, rank, totalUser })
      return rank
    } catch (error) {
      console.error(`Error getting miroNum rank: ${error}`)
      return null
    } finally {
      await prisma.$disconnect()
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
