'use client'
import BulkProductsUpload from '@components/flatfile/BulkProductsUpload'
import { FlatfileProvider } from '@flatfile/react'
export default function FlatfileComponent({
  publishableKey,
  accessToken,
}: {
  publishableKey?: string
  accessToken?: string
}) {
  const handleUpdateFlatfileData = async (records: any) => {
    console.log('records >>', records)
  }
  console.log('flatfileConfig >>', { publishableKey, accessToken })
  return (
    <FlatfileProvider
      {...(accessToken
        ? { accessToken: accessToken }
        : {
            publishableKey: publishableKey || '',
          })}
      config={{ preload: true }}
    >
      <BulkProductsUpload callback={handleUpdateFlatfileData} />
    </FlatfileProvider>
  )
}
