import { useEffect, useState } from 'react'

type Config = {
  environmentId?: string
  publishableKey?: string
  accessToken?: string
} | null

export const useFlatfileConfig = (FLATFILE_KEY: string) => {
  const [config, setConfig] = useState<Config>(null)

  useEffect(() => {
    const fetchData = async () => {
      const environmentId = process.env.NEXT_PUBLIC_FLATFILE_ENV_ID || ''
      const publishableKey =
        process.env.NEXT_PUBLIC_FLATFILE_PUBLISHABLE_KEY || ''

      let config: Config = null

      // Note: For Future References
      // if (FLATFILE_KEY) {
      //   const existingSpaceId = window.localStorage.getItem(FLATFILE_KEY)
      //   if (existingSpaceId) {
      //     const response = await fetch(
      //       `/api/flatfile/spaces/${existingSpaceId}`
      //     )
      //     const json = await response.json()
      //     if (!json?.error) {
      //       config = {
      //         environmentId,
      //         publishableKey,
      //         accessToken: json.space.data.accessToken,
      //       }
      //     } else {
      //       window.localStorage.removeItem(FLATFILE_KEY)
      //     }
      //   }
      // }

      if (!config) {
        config = {
          environmentId,
          publishableKey,
        }
      }

      setConfig(config)
    }

    fetchData()
  }, [])

  return {
    config,
  }
}
