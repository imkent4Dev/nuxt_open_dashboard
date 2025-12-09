// composables/useApi.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const apiUrl = config.public.apiBase || 'http://localhost:8081'

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${apiUrl}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*',
      ...options.headers
    }

    // Add auth token if available
    if (authStore.accessToken && !options.skipAuth) {
      headers['Authorization'] = `${authStore.tokenType} ${authStore.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && !options.skipAuth) {
        const refreshed = await authStore.refreshAccessToken()
        if (refreshed) {
          // Retry the request with new token
          return apiCall(endpoint, options)
        } else {
          await authStore.logout()
          throw new Error('Session expired. Please login again.')
        }
      }

      // Handle other error responses
      if (!response.ok) {
        throw new Error(data.message?.en || data.message || `Request failed with status ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }

  return {
    // Auth endpoints
    login: (credentials) => apiCall('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true
    }),

    logout: () => apiCall('/api/v1/auth/logout', {
      method: 'POST'
    }),

    refreshToken: (refreshToken) => apiCall('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true
    }),

    // Generic methods for other API calls
    get: (endpoint, options = {}) => apiCall(endpoint, {
      method: 'GET',
      ...options
    }),

    post: (endpoint, body, options = {}) => apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options
    }),

    put: (endpoint, body, options = {}) => apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options
    }),

    delete: (endpoint, options = {}) => apiCall(endpoint, {
      method: 'DELETE',
      ...options
    })
  }
}