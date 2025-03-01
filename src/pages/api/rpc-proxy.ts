import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const RPC_ENDPOINT = 'https://rpc.sepolia.org'

  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.body
    })

    const data = await response.json()

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

    res.status(200).json(data)
  } catch (error) {
    console.error('RPC Proxy Error:', error)
    res.status(500).json({ error: 'RPC request failed' })
  }
}
