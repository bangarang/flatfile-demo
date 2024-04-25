import api from '@flatfile/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  try {
    const space = await api.spaces.get(`${id}`)
    res.json({ space })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve space' })
  }
}
