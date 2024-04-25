import addressParser from 'parse-address'
import { FLATFILE_MESSAGES as messages, US_STATES } from './data'
import { ValidationMessage } from '@flatfile/api/api'

export const validateJson = (data: any) => {
  let jsonData
  try {
    jsonData = JSON.parse(data)
  } catch (e) {
    jsonData = data
  }
  return jsonData
}

export const setRecordError = (record: any, error: any, options?: any) => {
  const { skipAddError = false } = options ?? {}

  const errorMessage = String(error?.message || 'Something went wrong.')
  if (!skipAddError) record.addError('error_message', errorMessage)
  record.set('error_message', errorMessage)
}

export const mapReturnRecords = (recordData: any) => {
  const rows: any = {}
  if (recordData?.data?.records?.length) {
    rows.rows = recordData.data.records.map((d: any) => {
      const values: any = {}
      const messagesData: ValidationMessage[] = []
      const valueKeys = Object.keys(d.values)

      valueKeys.forEach((key) => {
        const { value, messages } = d.values[key] ?? {}

        values[key] = value

        if (messages && Array.isArray(messages) && messages.length > 0) {
          messagesData.push(...messages)
        }
      })

      const info = messagesData.map((d) => ({
        level: d.type,
        // @ts-ignore
        key: d.field,
        message: d.message,
      }))

      return {
        data: values,
        id: d.id,
        info,
        status: 'accepted',
        valid: d.valid,
      }
    })
    rows.totalRows = recordData.data.records.length
  }
  return rows
}

export const cityStateLookUp = async (zip: any) => {
  try {
    const response = await fetch(`/api/usps/city-state-look-up/${zip}`)
    const json = await response.json()
    return json
  } catch (error) {
    throw error
  }
}

export const validateAddress = async (record: any) => {
  try {
    let response: any = await fetch('/api/usps/validate-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Address1: String(record.get('addressLine1') || ''),
        Address2: String(record.get('addressLine2') || ''),
        City: String(record.get('city') || ''),
        State: String(record.get('state') || ''),
        Zip5: String(record.get('postalCode') || ''),
      }),
    })

    const json = await response.json()

    return json?.success || false
  } catch (error) {
    throw error
  }
}

// Previous Declaration: addressValidation
export const verifyAddress = async (record: any) => {
  try {
    record.set('validation', messages.validation.valid)

    let isValidAddress = await validateAddress(record)

    if (!isValidAddress) {
      record.set('validation', messages.validation.invalid)
      record.addWarning(
        [
          'validation',
          'state',
          'shippingMethod',
          'quantity',
          'postalCode',
          'phone',
          'lastName',
          'firstName',
          'email',
          'countryCode',
          'city',
          'addressLine2',
          'addressLine1',
        ],
        messages.usps.errorInvalid
      )
    }

    let zipCode = String(record.get('postalCode') || '')
    // check if city and state is invalid based on zipcode

    let zipResult = await cityStateLookUp(zipCode).catch((error) => {

      record.set('validation', messages.validation.invalid)
      record.addError(['postalCode'], messages.usps.errorZipInvalid)

      if (isValidAddress) {
        record.addWarning(
          [
            'validation',
            'state',
            'shippingMethod',
            'quantity',
            'phone',
            'lastName',
            'firstName',
            'email',
            'countryCode',
            'city',
            'addressLine2',
            'addressLine1',
          ],
          messages.usps.errorZipInvalid
        )
      }
      // record.set('error_message', err.message)
      return null
    })

    if (zipResult instanceof Error) {
    } else if (zipResult) {
      let { City: city, State: stateCode } = zipResult ?? {}

      let invalidCityState = false
      if (stateCode !== record.get('state')) {
        record.addError(
          ['state', 'postalCode'],
          `State Code for entered zipcode should be ${stateCode}, please verify this.`
        )
        invalidCityState = true
      }
      if (
        city?.toLowerCase() !== String(record.get('city') || '')?.toLowerCase()
      ) {
        record.addError(
          ['city', 'postalCode'],
          `City for entered zipcode should be ${city}, please verify this.`
        )
        invalidCityState = true
      }

      if (invalidCityState && isValidAddress) {
        record.set('validation', messages.validation.invalid)
        record.addWarning(
          [
            'shippingMethod',
            'quantity',
            'email',
            'phone',
            'countryCode',
            'firstName',
            'lastName',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'validation',
            'postalCode',
          ],
          messages.usps.errorStateCity
        )
      }
    }

    record.addComment('validation', messages.validation.comment)
  } catch (error) {
    setRecordError(record, error)
  }
}

// Previous Declaration: addressSplitter
export const verifyAddressByParsing = async (record: any) => {
  try {
    const city = record.get('city')
    if (!city) {
      let streetAddress = record.get('streetAddress')
      if (streetAddress && record.get('countryCode') === 'US') {
        const parsed = addressParser.parseLocation(streetAddress)
        record.set('parsedAddress', JSON.stringify(parsed))
        const { street, sec_unit_type, sec_unit_num, city, state, zip } = parsed

        if (!street) {
          streetAddress = [sec_unit_type, sec_unit_num].join(' ')
        } else {
          const { type, street, prefix, number } = parsed
          streetAddress = [number, prefix, street, type].join(' ')
        }
        record.set('streetAddress', streetAddress)
        record.set('city', city)
        record.set('state', state)
        record.set('postalCode', zip)
      }
    }
  } catch (error) {
    setRecordError(record, error)
  }
}

// Previous Declaration: alcoholValidations
export const verifyAlcohol = async (record: any, data: any) => {
  try {
    let { products, StateAlcoholMapping, AlcoholCategoryId } = data
    let state = StateAlcoholMapping.find(
      (v: any) => v.state_code == record.get('state')
    )
    let allowedAlcoholInState = null
    if (state) {
      allowedAlcoholInState = !state?.no_ship_alcohol
    }

    let product = products.find(
      (v: any) =>
        v.name == record.get('product') || v.sku == record.get('product')
    )

    const isProductAlcoholic = product
      ? product.categories.includes(AlcoholCategoryId)
      : null

    if (allowedAlcoholInState !== null && isProductAlcoholic !== null) {
      if (!allowedAlcoholInState && isProductAlcoholic) {
        record.set('validation', messages.validation.invalid)
        record.addError(['state', 'error_message'], messages.state.errorState)

        // record.set("error_message", messages.state.errorState);
        record.addWarning(
          [
            'validation',
            'addressLine1',
            'addressLine2',
            'city',
            'postalCode',
            // 'product',
            'shippingMethod',
            'quantity',
            'email',
            'phone',
            'countryCode',
            'firstName',
            'lastName',
          ],
          messages.state.errorState
        )
        record.addComment('validation', messages.validation.comment)
      }
    }
  } catch (error) {
    setRecordError(record, error, { skipAddError: true })
  }
}

// Previous Declaration: fieldValidations
export const verifyBasicValues = async (record: any, options?: any) => {
  const { checkQuantity = true } = options ?? {}

  try {
    if (
      !(
        record.get('firstName') &&
        String(record.get('firstName')).trim().length > 0
      )
    ) {
      record.set('validation', messages.validation.invalid)
      record.addError('firstName', messages.firstName.blankError)
      record.addComment('validation', messages.validation.comment)
    }

    if (
      !(
        record.get('lastName') &&
        String(record.get('lastName')).trim().length > 0
      )
    ) {
      record.set('validation', messages.validation.invalid)
      record.addError('lastName', messages.lastName.blankError)
      record.addComment('validation', messages.validation.comment)
    }

    if (checkQuantity) {
      if (!record.get('quantity') || record.get('quantity') == 0) {
        record.set('quantity', 1)
      }

      const quantity = Number(record.get('quantity')) || 1

      if (!Number.isInteger(quantity)) {
        record.addError(
          'quantity',
          Number.isNaN(quantity)
            ? messages.quantity.errorSpecialCharacters
            : messages.quantity.errorNonInteger
        )
      }

      if (!record.get('shippingMethod')) {
        record.set('shippingMethod', 'ground')
      }
    }

    if (!record.get('addressLine1')) {
      record.set('validation', messages.validation.invalid)
      record.addError('addressLine1', messages.addressLine1.errorRequired)
      record.addComment('validation', messages.validation.comment)
    }

    if (!record.get('email')) {
      record.set('validation', messages.validation.invalid)
      record.addError('email', messages.email.errorRequired)
      record.addComment('validation', messages.validation.comment)
    }

    if (!record.get('state')) {
      record.set('validation', messages.validation.invalid)
      record.addError('state', messages.state.errorRequired)
      record.addComment('validation', messages.validation.comment)
    }

    if (!record.get('city')) {
      record.set('validation', messages.validation.invalid)
      record.addError('city', messages.city.errorRequired)
      record.addComment('validation', messages.validation.comment)
    }

    if (!record.get('postalCode')) {
      record.set('validation', messages.validation.invalid)
      record.addError('postalCode', messages.postalCode.errorRequired)
      record.addComment('validation', messages.validation.comment)
    }
  } catch (error) {
    setRecordError(record, error)
  }
}

// Previous Declarations: stateNormalizer + stateEligibilityCheck
export const verifyState = async (record: any) => {
  try {
    let countryCode = record.get('countryCode') || 'US'
    let state = record.get('state')

    if (countryCode != 'US') {
      record.addError('countryCode', messages.country.errorMustUS)
    }

    if (state && countryCode === 'US') {
      if (!US_STATES.find((c) => c.code_2 === state)) {
        const suggestion = US_STATES.find(
          (c) => c.name.toLowerCase() == String(state || '').toLowerCase()
        )
        state = suggestion ? suggestion.code_2 : state
        record.set('state', state)
        if (!suggestion) {
          record.addError('state', messages.state.errorInvalid)
        }
      }
    }

    state = String(record.get('state') || '')
    if (['AK', 'HI'].includes(state)) {
      record.set('validation', messages.validation.invalid)
      record.addError('state', messages.state.errorDeliver)
    } else {
      record.set('validation', messages.validation.valid)
    }
    record.addComment('validation', messages.validation.comment)
  } catch (error) {
    setRecordError(record, error)
  }
}
