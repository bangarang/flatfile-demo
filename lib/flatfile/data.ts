export const FLATFILE_THEME_LOGO =
  'https://www.cocktailcourier.com/logo-cc-orange.svg'

/**
 * Regular expression pattern for matching dates in MM/DD/YYYY format.
 * Allows for flexibility in separator characters ("/", "-", ".", or " ").
 *
 * Example matches:
 * - 01/23/2024
 * - 12-31-99
 * - 3.15.2022
 * - 05 05 2023
 *
 * Example non-matches:
 * - 13/25/2023 (invalid month and day)
 * - 02/29/2021 (not a leap year)
 * - 1/2/3 (year missing)
 * - 04-2024 (day missing)
 */
export const DATE_REGEX =
  /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/

/**
 * Array of objects representing US states and territories along with their two-letter codes.
 * Each object contains the following properties:
 * - `name`: The name of the state or territory.
 * - `code_2`: The two-letter postal abbreviation for the state or territory.
 */
export const US_STATES = [
  { name: 'Alabama', code_2: 'AL' },
  { name: 'Alaska', code_2: 'AK' },
  { name: 'American Samoa', code_2: 'AS' },
  { name: 'Arizona', code_2: 'AZ' },
  { name: 'Arkansas', code_2: 'AR' },
  { name: 'California', code_2: 'CA' },
  { name: 'Colorado', code_2: 'CO' },
  { name: 'Connecticut', code_2: 'CT' },
  { name: 'Delaware', code_2: 'DE' },
  { name: 'District of Columbia', code_2: 'DC' },
  { name: 'Federated States of Micronesia', code_2: 'FM' },
  { name: 'Florida', code_2: 'FL' },
  { name: 'Georgia', code_2: 'GA' },
  { name: 'Guam', code_2: 'GU' },
  { name: 'Hawaii', code_2: 'HI' },
  { name: 'Idaho', code_2: 'ID' },
  { name: 'Illinois', code_2: 'IL' },
  { name: 'Indiana', code_2: 'IN' },
  { name: 'Iowa', code_2: 'IA' },
  { name: 'Kansas', code_2: 'KS' },
  { name: 'Kentucky', code_2: 'KY' },
  { name: 'Louisiana', code_2: 'LA' },
  { name: 'Maine', code_2: 'ME' },
  { name: 'Marshall Islands', code_2: 'MH' },
  { name: 'Maryland', code_2: 'MD' },
  { name: 'Massachusetts', code_2: 'MA' },
  { name: 'Michigan', code_2: 'MI' },
  { name: 'Minnesota', code_2: 'MN' },
  { name: 'Mississippi', code_2: 'MS' },
  { name: 'Missouri', code_2: 'MO' },
  { name: 'Montana', code_2: 'MT' },
  { name: 'Nebraska', code_2: 'NE' },
  { name: 'Nevada', code_2: 'NV' },
  { name: 'New Hampshire', code_2: 'NH' },
  { name: 'New Jersey', code_2: 'NJ' },
  { name: 'New Mexico', code_2: 'NM' },
  { name: 'New York', code_2: 'NY' },
  { name: 'North Carolina', code_2: 'NC' },
  { name: 'North Dakota', code_2: 'ND' },
  { name: 'Northern Mariana Islands', code_2: 'MP' },
  { name: 'Ohio', code_2: 'OH' },
  { name: 'Oklahoma', code_2: 'OK' },
  { name: 'Oregon', code_2: 'OR' },
  { name: 'Palau', code_2: 'PW' },
  { name: 'Pennsylvania', code_2: 'PA' },
  { name: 'Puerto Rico', code_2: 'PR' },
  { name: 'Rhode Island', code_2: 'RI' },
  { name: 'South Carolina', code_2: 'SC' },
  { name: 'South Dakota', code_2: 'SD' },
  { name: 'Tennessee', code_2: 'TN' },
  { name: 'Texas', code_2: 'TX' },
  { name: 'Utah', code_2: 'UT' },
  { name: 'Vermont', code_2: 'VT' },
  { name: 'Virgin Islands', code_2: 'VI' },
  { name: 'Virginia', code_2: 'VA' },
  { name: 'Washington', code_2: 'WA' },
  { name: 'West Virginia', code_2: 'WV' },
  { name: 'Wisconsin', code_2: 'WI' },
  { name: 'Wyoming', code_2: 'WY' },
]

export const FLATFILE_MESSAGES = {
  validation: {
    valid: 'Eligible for Delivery',
    invalid: 'Ineligible for delivery',
    comment: 'System determined eligibility',
  },
  firstName: {
    blankError: 'Recipient First Name can not be blank.',
  },
  lastName: {
    blankError: 'Recipient Last Name can not be blank.',
  },
  quantity: {
    errorSpecialCharacters: 'We recommend removing any special characters.',
    errorNonInteger: 'Quantity should not contain floating/decimal numbers.',
  },
  addressLine1: {
    errorRequired: 'Recipient Address is required',
  },
  email: {
    errorRequired:
      'Recipient Email Address is required for order notifications only',
  },
  state: {
    errorState:
      'We cannot ship Alcohol to this state. We recommend choosing a Just the Mix Kit',
    errorDeliver: 'We cannot deliver to Alaska or Hawaii',
    errorInvalid: 'US State is not valid',
    errorRequired: 'State is required',
  },
  city: {
    errorRequired: 'City is required',
  },
  postalCode: {
    errorRequired: 'Zip is required',
  },
  country: {
    errorMustUS: 'Country Code must be US',
  },
  usps: {
    errorStateCity: 'State Code or City is not valid',
    errorZipInvalid: 'Please verify zipcode',
    errorInvalid:
      'Current address not recognized by USPS. Proceeding with address as entered, may result in interruption of delivery.',
  },
  giftCardDeliveryDate: {
    errorInvalid: 'Value is incorrect.',
  },
}

export const FLATFILE_KEYS = {
  giftCards: 'giftCertificatesFlatFile',
  recipients: 'bulkRecipientsFlatFile',
  products: 'bulkProductsFlatFile',
}

export const DEMO_FAKE_DATA = {
  alcoholCategoryId: 1,
  products: [
    {
      name: 'Title 123123',
      sku: '123123',
      categories: [1, 2, 3],
      id: '1',
    },
    {
      name: 'Name 121212',
      sku: '121212',
      categories: [1, 2, 3, 4],
      id: '2',
    },
  ],
  states: [
    {
      id: 44,
      state_name: 'Ohio',
      state_code: 'OH',
      vendor_name: null,
      no_ship_alcohol: true,
      show_state: true,
    },
    {
      id: 36,
      state_name: 'North Carolina',
      state_code: 'NC',
      vendor_name: null,
      no_ship_alcohol: true,
      show_state: true,
    },
  ],
}
