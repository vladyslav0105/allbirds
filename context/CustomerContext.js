import { createContext, useContext, useState, useEffect } from 'react'
import { accountClientPost } from '@/utils/account'
import { CUSTOMER_ACCESS_TOKEN_CREATE, CUSTOMER_ACCESS_TOKEN_DELETE, GET_CUSTOMER, CUSTOMER_CREATE, CUSTOMER_RECOVER, CUSTOMER_RESET, transformEdges } from '@/gql/index.js'
import { encode } from 'js-base64'
import * as Cookies from 'es-cookie'
import moment from 'moment'

const CustomerContext = createContext()

export function useCustomerContext() {
  return useContext(CustomerContext)
}

export function CustomerProvider({ children }) {

  const [customer, setCustomer] = useState(null)
  const [customerLoading, setCustomerLoading] = useState(false)
  const [subsData, setSubsData] = useState(null)

  useEffect(() => {
    const customerAccessToken = Cookies.get('customerAccessToken')
    // console.log("customerAccessToken:", customerAccessToken)
    if (customerAccessToken) {
      getCustomer({ accessToken: customerAccessToken })
    }
  }, [])

  async function createCustomerAccessToken({ email, password }) {
    const response = await accountClientPost({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: {
          email,
          password
        }
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { customerAccessTokenCreateErrors: errors }
    }
    return { customerAccessTokenCreate: data.customerAccessTokenCreate }
  }

  async function getCustomer({accessToken, expiresAt}) {
    setCustomerLoading(true)
    const response = await accountClientPost({
      query: GET_CUSTOMER,
      variables: {
        customerAccessToken: accessToken
      }
    })
    const { data, errors } = response
    setCustomerLoading(false)
    if (errors && errors.length) {
      return { errors: errors }
    }
    if (data?.customer && expiresAt) {
      Cookies.set('customerAccessToken', accessToken, { expires: new Date(expiresAt), path: '/' })
    }

    const { customer } = data

    // TODO: might need to turn this into a useReducer instead of using useState above
    if (data?.customer?.tags?.length) {
      if (data.customer.tags.some(tag => ['member', 'premium member', 'prepaid'].includes(tag))) {
        customer.is_member = true
      } else {
        customer.is_member = false
      }
    }

    if (customer?.addresses?.edges.length > 0) {
      customer.addresses = transformEdges(customer.addresses)
    }

    setCustomer(customer)

    getSubs(customer)

    console.log("customer:", customer)
    return { data }
  }

  async function getSubs(customer) {
    if (customer?.id) {
      const idArr = customer.id.split('/')
      const id = idArr[idArr.length - 1]
      fetch('/api/account/get-subs?cID=' + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === 'success') {
            setSubsData(res.data)
            console.log('get-subs', res.data)
          }
        })
    }
  }

  async function login({ email, password }) {
    const { customerAccessTokenCreateErrors, customerAccessTokenCreate } = await createCustomerAccessToken({email, password})
    if (customerAccessTokenCreateErrors) {
      return { errors: customerAccessTokenCreateErrors }
    }
    if (customerAccessTokenCreate.userErrors.length) {
      return { errors: customerAccessTokenCreate.userErrors }
    }
    const customerAccessToken = customerAccessTokenCreate.customerAccessToken
    return getCustomer({
      accessToken: customerAccessToken.accessToken,
      expiresAt: customerAccessToken.expiresAt
    })
  }

  async function logout() {
    const customerAccessToken = Cookies.get('customerAccessToken')
    const response = await accountClientPost({
      query: CUSTOMER_ACCESS_TOKEN_DELETE,
      variables: { customerAccessToken: customerAccessToken }
    })
    const { deletedAccessToken, userErrors } =
    response.data.customerAccessTokenDelete
    if (deletedAccessToken) {
      setCustomer(null)
      Cookies.remove('customerAccessToken')
    }
    return { deletedAccessToken, errors: userErrors }
  }

  async function register({ firstName, lastName, email, password }) {
    const response = await accountClientPost({
      query: CUSTOMER_CREATE,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password
        }
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { errors: errors }
    }
    const { customerUserErrors } = data.customerCreate
    return { data, errors: customerUserErrors }
  }

  async function recover({ email }) {
    const response = await accountClientPost({
      query: CUSTOMER_RECOVER,
      variables: {
        email
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { errors: errors }
    }
    const { customerUserErrors } = data.customerRecover
    return { data, errors: customerUserErrors }
  }

  async function reset({ password, customerId, resetToken }) {
    const id = encode(`gid://shopify/Customer/${customerId}`)
    const response = await accountClientPost({
      query: CUSTOMER_RESET,
      variables: {
        id,
        input: {
          password,
          resetToken
        }
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { errors: errors }
    }
    const { customerUserErrors } = data.customerReset
    return { data, errors: customerUserErrors }
  }

  return (
    <CustomerContext.Provider value={{customer, setCustomer, customerLoading, login, logout, register, recover, reset, subsData}}>
      {children}
    </CustomerContext.Provider>
  )
}