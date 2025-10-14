// utils/api.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL

  const request = async (endpoint, options = {}) => {
    try {
      const {
        method = 'GET',
        data,
        params,
        headers = {},
        token
      } = options

      return await $fetch(endpoint, {
        baseURL,
        method,
        params,
        body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
        headers: {
          ...(data && !(data instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers
        }
      })
    } catch (error) {
      console.error('API Error:', error)
      throw createError({
        statusCode: error?.response?.status || 500,
        statusMessage: error?.response?._data?.message || error.message || 'API request failed'
      })
    }
  }

  return { request }
}
