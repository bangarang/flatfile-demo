import { NextApiRequest, NextApiResponse } from 'next'
import USPS from 'usps-webtools-promise'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' })
    return
  }

  if(!process.env.USPS_USER_ID) {
    res.status(400).send({ message: 'Something went wrong!' })
    return
  }

  try {
    const usps = new USPS({
      userId: process.env.USPS_USER_ID, // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
    })

    const result = await usps.cityStateLookup(`${req.query.zip}`)
    if (result && result.toString().toLowerCase().includes('error')) {
      throw new Error(result.toString())
    }
    res.json({ ...result })
  } catch (error) {
    throw error
  }
}
