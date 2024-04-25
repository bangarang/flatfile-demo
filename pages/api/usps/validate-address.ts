import { NextApiRequest, NextApiResponse } from 'next'
import USPS from 'usps-webtools-promise'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  if(!process.env.USPS_USER_ID) {
    res.status(400).send({ message: 'Something went wrong!' })
    return
  }

  let body = {}

  if (req.body) {
    try {
      body = JSON.parse(req.body)
    } catch (error) {
      body = req.body
    }
  }

  try {
    const usps = new USPS({
      userId: process.env.USPS_USER_ID, // This can be created by going to https://www.usps.com/business/web-tools-apis/ and registering for an id
    })

    let response = await usps
      .verify(body)
      .then(() => true)
      .catch(() => false)

    res.json({ success: response })
  } catch (error) {
    throw error
  }
}
