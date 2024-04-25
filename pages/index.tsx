import BulkProductsUpload from '@components/flatfile/BulkProductsUpload'
import { useFlatfileConfig } from '@components/flatfile/useFlatfileConfig'
import { FlatfileProvider } from '@flatfile/react'
import { FLATFILE_KEYS } from '@lib/flatfile/data'

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 200,
  }
}

export default function Home() {
  const { config: flatfileConfig } = useFlatfileConfig(FLATFILE_KEYS.products)

  const handleUpdateFlatfileData = async (records: any) => {
    console.log('records >>', records)
  }

  return (
    <>
      {Boolean(
        flatfileConfig?.publishableKey || flatfileConfig?.accessToken
      ) && (
        <FlatfileProvider
          {...(flatfileConfig?.accessToken
            ? { accessToken: flatfileConfig?.accessToken }
            : {
                publishableKey: flatfileConfig?.publishableKey || '',
              })}
          config={{ preload: true }}
        >
          <BulkProductsUpload callback={handleUpdateFlatfileData} />
        </FlatfileProvider>
      )}
    </>
  )
}
