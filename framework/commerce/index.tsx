import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react'

const Commerce = createContext<CommerceContextValue<any> | {}>({})

export type Provider = CommerceConfig

export type CommerceProps<P extends Provider> = {
  children?: ReactNode
  provider: P
  config: CommerceConfig
}

export type CommerceConfig = Omit<
  CommerceContextValue<any>,
  'providerRef' | 'fetcherRef'
>

export type CommerceContextValue<P extends Provider> = {
  providerRef: MutableRefObject<P>
  fetcherRef: MutableRefObject<any>
  locale: string
  cartCookie: string
}

export function CommerceProvider<P extends Provider>({
  provider,
  children,
  config,
}: CommerceProps<P>) {
  if (!config) {
    throw new Error('CommerceProvider requires a valid config object')
  }

  const providerRef = useRef(provider)
  // TODO: Remove the fetcherRef
  // const fetcherRef = useRef(provider.fetcher)
  // Because the config is an object, if the parent re-renders this provider
  // will re-render every consumer unless we memoize the config
  const cfg = useMemo(
    () => ({
      providerRef,
      // fetcherRef,
      locale: config.locale,
      cartCookie: config.cartCookie,
    }),
    [config.locale, config.cartCookie]
  )

  return <Commerce.Provider value={cfg}>{children}</Commerce.Provider>
}

export function useCommerce<P extends Provider>() {
  return useContext(Commerce) as CommerceContextValue<P>
}
