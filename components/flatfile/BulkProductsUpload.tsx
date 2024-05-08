'use client'
import { Flatfile, FlatfileClient } from '@flatfile/api'
import { recordHook } from '@flatfile/plugin-record-hook'
import {
  Space,
  Workbook,
  makeTheme,
  useEvent,
  useFlatfile,
  useListener,
  usePlugin,
} from '@flatfile/react'
import {
  DEMO_FAKE_DATA,
  FLATFILE_KEYS,
  FLATFILE_THEME_LOGO,
} from '@lib/flatfile/data'
import {
  bulkProductsWorkBook,
  validateProductsRecord,
} from '@lib/flatfile/products'
import { mapReturnRecords } from '@lib/flatfile/validations'
import { useEffect, useMemo, useState } from 'react'

const FLATFILE_KEY = FLATFILE_KEYS.products

export interface Options {
  alcoholCategoryId: number
  products: {
    name: string
    sku: string
    categories: number[]
    id: string
  }[]
  states: {
    id: number
    state_name: string
    state_code: string
    vendor_name: any
    no_ship_alcohol: boolean
    show_state: boolean
  }[]
}

export const BulkProductsUpload = ({
  callback,
}: {
  callback: (records: any) => void
}) => {
  const [options, setOptions] = useState<Options>({
    alcoholCategoryId: 0,
    products: [],
    states: [],
  })
  const { open, openPortal, closePortal } = useFlatfile()

  useEffect(() => {
    const fetchData = async () => {
      const cmsEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL

      // API CALLS
      // const [statesRes, productsRes, alcoholCategoryRes] = await Promise.all([
      //   axios.get(`${cmsEndpoint}${FLATFILE_ENDPOINTS.states}`),
      //   axios.get(FLATFILE_ENDPOINTS.products),
      //   axios.get(FLATFILE_ENDPOINTS.alcoholic),
      // ])

      setOptions(DEMO_FAKE_DATA)
    }

    fetchData()
  }, [])

  useListener((listener) => {
    listener.on('space:created', ({ context: { spaceId } }) => {
      try {
        if (spaceId) {
          window?.localStorage?.setItem(FLATFILE_KEY, spaceId)
        }
      } catch (error) {}
    })
  })

  usePlugin(
    recordHook('bulkProducts', (record) => {
      const { alcoholCategoryId, products, states } = options
      return validateProductsRecord(record, {
        alcoholCategoryId,
        products,
        states,
      })
    }),
    [
      options?.alcoholCategoryId,
      options?.products?.length,
      options?.states?.length,
    ]
  )

  useEvent(
    'job:outcome-acknowledged',
    {
      operation: 'workbookSubmitAction',
      status: 'complete',
    },
    async () => {
      window?.localStorage?.removeItem(FLATFILE_KEY)

      closePortal()
    }
  )

  const workbookConfig = useMemo(() => {
    const mappedConfig = { ...bulkProductsWorkBook }

    if (
      options.products &&
      Array.isArray(options.products) &&
      options.products.length > 0
    ) {
      mappedConfig.sheets?.forEach((sheet, i) => {
        sheet.fields.forEach((field, j) => {
          if (field.key === 'product' && mappedConfig?.sheets?.[i]) {
            const updated = {
              ...field,
              config: {
                options: options.products.map(
                  (d: { name: string; sku: string }) => ({
                    label: d.name,
                    value: d.sku,
                  })
                ),
              },
            } as Flatfile.Property.Enum

            mappedConfig.sheets[i].fields[j] = updated
          }
        })
      })
    }

    return mappedConfig
  }, [options?.products?.length])

  return (
    <>
      <button
        aria-label="group-order-over-fifty"
        className="btn btn-brand"
        disabled={!(options?.products?.length > 0)}
        onClick={() => (open ? closePortal?.() : openPortal?.())}
      >
        Get Started
      </button>
      {options?.products?.length > 0 && (
        <Space
          config={{
            name: bulkProductsWorkBook.name,
            metadata: {
              sidebarConfig: { showDataChecklist: false, showSidebar: false },
              themeConfig: makeTheme({ logo: FLATFILE_THEME_LOGO }),
            },
          }}
        >
          <Workbook
            config={workbookConfig}
            onSubmit={async (sheet) => {
              try {
                const api = new FlatfileClient();
                if (sheet?.sheet?.sheetId) {
                  const recordData = await api.records.get(sheet.sheet.sheetId)

                  const rows: any = mapReturnRecords(recordData)

                  callback(rows)
                }
              } catch (error) {}
            }}
          />
        </Space>
      )}
    </>
  )
}

export default BulkProductsUpload
