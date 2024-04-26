import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

/** 领取miro */
export default async function getMiro(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.address) {
    throw new Error('address is required')
  }

  if (req.method === 'POST') {
    const { address,miroNum } = req.body
    try {
      // 先查找是否存在
      const existingRecord = await prisma.miro_eth.findUnique({
        where: {
          walletAddress: address,
        },
      })

      res.status(200).json({ message: `Hello, ${existingRecord}!` })

      console.log(existingRecord)

      if (!existingRecord) {
        // 不存在则新增
        await prisma.miro_eth.create({
          data: {
            walletAddress: address,
            miroNum
          },
        })
        console.log(`New record created for address: ${address}`)
      } else {
        console.log(`Record already exists for address: ${address}`)
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
