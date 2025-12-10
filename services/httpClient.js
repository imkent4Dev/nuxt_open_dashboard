import { useAuthStore } from "~/stores/auth"

// services/httpClient.js
export class HttpClient {
  constructor(baseURL, authStore = null) {
    this.baseURL = baseURL
    this.authStore = authStore
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        ...options.headers
      }
    }
    
    // Add auth headers if store is available and user is authenticated
    if (this.authStore?.isAuthenticated) {
      config.headers['Authorization'] = `${this.authStore.tokenType} ${this.authStore.accessToken}`
    }

    try {
      const response = await fetch(url, config)
      
      // Handle 401 - try to refresh token
      if (response.status === 401 && this.authStore) {
        const refreshed = await this.authStore.refreshAccessToken()
        
        if (refreshed) {
          // Retry the request with new token
          config.headers['Authorization'] = `${this.authStore.tokenType} ${this.authStore.accessToken}`
          return await fetch(url, config)
        }
      }

      return response
    } catch (error) {
      console.error('HTTP request failed:', error)
      throw error
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // Helper to parse JSON responses
  async parseResponse(response) {
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message?.en || data.message || `HTTP ${response.status}`)
    }
    
    return data
  }
}

// composables/useHttp.js
export const useHttp = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const client = new HttpClient(config.public.apiBase, authStore)
  
  return {
    client,
    // Convenience methods
    async get(endpoint) {
      const response = await client.get(endpoint)
      return client.parseResponse(response)
    },
    async post(endpoint, data) {
      const response = await client.post(endpoint, data)
      return client.parseResponse(response)
    },
    async put(endpoint, data) {
      const response = await client.put(endpoint, data)
      return client.parseResponse(response)
    },
    async patch(endpoint, data) {
      const response = await client.patch(endpoint, data)
      return client.parseResponse(response)
    },
    async delete(endpoint) {
      const response = await client.delete(endpoint)
      return client.parseResponse(response)
    }
  }
}

// Example usage in a component or composable:
// const { get, post } = useHttp()
// const users = await get('/api/v1/users')
// const result = await post('/api/v1/posts', { title: 'Hello' })