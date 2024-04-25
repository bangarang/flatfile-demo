import { Flatfile } from '@flatfile/api'
import {
  FlatfileRecord,
  TPrimitive,
  TRecordDataWithLinks,
} from '@flatfile/hooks'
import {
  setRecordError,
  verifyAddress,
  verifyAddressByParsing,
  verifyAlcohol,
  verifyBasicValues,
  verifyState,
} from './validations'

const bulkProductsSheet: Flatfile.SheetConfig = {
  name: 'Bulk Products',
  slug: 'bulkProducts',
  allowAdditionalFields: false,
  fields: [
    // validation
    {
      key: 'validation',
      type: 'string',
      label: 'Validation',
      readonly: true,
    } as Flatfile.Property.String,
    // firstName
    {
      key: 'firstName',
      type: 'string',
      label: 'Recipient First Name',
      description: "Recipient's first name",
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // lastName
    {
      key: 'lastName',
      type: 'string',
      label: 'Recipient Last Name',
      description: "Recipient's last name",
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // product
    {
      key: 'product',
      label: 'Product',
      type: 'enum',
      constraints: [
        {
          type: 'required',
        },
      ],
      config: {
        options: [], // Generating This Dynamically
      },
    } as Flatfile.Property.Enum,
    // quantity
    {
      key: 'quantity',
      type: 'number',
      label: 'Quantity',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.Number,
    // email
    {
      key: 'email',
      type: 'string',
      label: 'Recipient Email (for delivery notices)',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // company [optional]
    {
      key: 'company',
      type: 'string',
      label: 'Company (optional)',
    } as Flatfile.Property.String,
    // addressLine1
    {
      key: 'addressLine1',
      type: 'string',
      label: 'Recipient Address',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // addressLine2
    {
      key: 'addressLine2',
      type: 'string',
      label: 'Apt or Unit # (optional)',
    } as Flatfile.Property.String,
    // city
    {
      key: 'city',
      type: 'string',
      label: 'City',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // state
    {
      key: 'state',
      type: 'string',
      label: 'State',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // postalCode
    {
      key: 'postalCode',
      type: 'string',
      label: 'Zip',
      constraints: [
        {
          type: 'required',
        },
      ],
    } as Flatfile.Property.String,
    // countryCode
    {
      key: 'countryCode',
      type: 'string',
      label: 'Country Code',
    } as Flatfile.Property.String,
    // shippingMethod
    {
      key: 'shippingMethod',
      label: 'Shipping Method',
      type: 'enum',
      constraints: [
        {
          type: 'required',
        },
      ],
      config: {
        options: [
          {
            value: 'ground',
            label: 'Ground (Signature required)',
            alternativeNames: ['Ground'],
          },
          {
            value: '3day',
            label: '3 Days',
          },
          {
            value: '2day',
            label: '2 Days',
          },
          {
            value: 'overnight',
            label: 'Overnight Shipping',
          },
        ],
      },
    } as Flatfile.Property.Enum,
    // phone [optional]
    {
      key: 'phone',
      type: 'string',
      label: 'Phone (optional)',
    } as Flatfile.Property.String,
    // error_message
    {
      key: 'error_message',
      type: 'string',
      label: 'Error Message',
    } as Flatfile.Property.String,
    // giftMessage
    {
      key: 'giftMessage',
      type: 'string',
      label: 'Gift Message',
    } as Flatfile.Property.String,
  ],
}

export const bulkProductsWorkBook: Flatfile.CreateWorkbookConfig = {
  name: 'Bulk Products',
  sheets: [bulkProductsSheet],
}

export const validateProductsRecord = async (
  record: FlatfileRecord<TRecordDataWithLinks<TPrimitive>>,
  options?: any
) => {
  const { alcoholCategoryId, products, states } = options ?? {}

  try {
    await verifyBasicValues(record)
    await verifyAddressByParsing(record)
    await verifyState(record)
    await verifyAddress(record)
    await verifyAlcohol(record, {
      products,
      StateAlcoholMapping: states,
      AlcoholCategoryId: alcoholCategoryId,
    })
  } catch (error) {
    setRecordError(record, error)
  }

  return record
}
