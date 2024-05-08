import { useFlatfileConfig } from '@components/flatfile/useFlatfileConfig'
import { FLATFILE_KEYS } from '@lib/flatfile/data'
import dynamic from 'next/dynamic'
// const FlatfileComponent = dynamic(() => import('./FlatfileComponent'), {
//   loading: () => <span>...placeholder Not Real Content...</span>,
//   ssr: false,
// })

import FlatfileComponent from './FlatfileComponent'

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 200,
  }
}

export default function Home() {
  const { config: flatfileConfig } = useFlatfileConfig(FLATFILE_KEYS.products)
  console.log('HOME', { FlatfileComponent, flatfileConfig })
  if (flatfileConfig?.publishableKey || flatfileConfig?.accessToken) {
    console.log('we have keys', {
      publishableKey: flatfileConfig?.publishableKey,
      accessToken: flatfileConfig?.accessToken,
    })
    return (
      <FlatfileComponent
        publishableKey={flatfileConfig?.publishableKey}
        accessToken={flatfileConfig?.accessToken}
      />
    )
  }
  return <>Loading..</>
}
