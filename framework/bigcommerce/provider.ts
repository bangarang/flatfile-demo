import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useRemoveItem } from './cart/use-remove-item'

import { handler as useCustomer } from './customer/use-customer'
import { handler as useCustomerAddresses } from './customer/use-customer-addresses'
import { handler as useAddCustomerAddress } from './customer/create-customer-addresses'
import { handler as useUpdateCustomerAddress } from './customer/update-customer-addresses'
import { handler as useCustomerDeleteAddress } from './customer/delete-customer-addresses'


import { handler as useUpdateCustomer } from './customer/update-customer'
import { handler as useOrders } from './customer/get-orders'
import { handler as useOrder } from './customer/get-order-detail'

import { handler as useSearch } from './product/use-search'
import { handler as useReview } from './product/use-review'
import { handler as useCategory } from './product/use-category'
import { handler as useProducts } from './product/use-products'

import { handler as useLogin } from './auth/use-login'
import { handler as useLogout } from './auth/use-logout'
import { handler as useSignup } from './auth/use-signup'

import fetcher from './fetcher'

export const bigcommerceProvider = {
  locale: 'en-us',
  cartCookie: 'bc_cartId',
  fetcher,
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  customer: {
    useCustomer,
    useCustomerAddresses,
    useAddCustomerAddress,
    useCustomerDeleteAddress,
    useUpdateCustomerAddress,
    useUpdateCustomer,
    useOrders,
    useOrder
  },
  products: { useSearch, useReview, useCategory, useProducts },
  auth: { useLogin, useLogout, useSignup },
}

export type BigcommerceProvider = typeof bigcommerceProvider
