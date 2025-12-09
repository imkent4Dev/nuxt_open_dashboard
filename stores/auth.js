// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresIn: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        // Get API base URL from runtime config
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiBase || 'http://localhost:8081'

        // Prepare the exact same payload as curl
        const payload = {
          usernameOrEmail: credentials.usernameOrEmail || credentials.email || credentials.username,
          password: credentials.password
        }

        console.log('Sending login request to:', `${apiUrl}/api/v1/auth/login`)
        console.log('Payload:', payload)

        // Use direct fetch to backend (since it works in your test)
        const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        console.log('Response status:', response.status)
        
        const data = await response.json()
        console.log('Response data:', data)

        // Check if response is successful
        if (response.ok && data.success && data.data) {
          // Store tokens and user data
          this.accessToken = data.data.accessToken
          this.refreshToken = data.data.refreshToken
          this.tokenType = data.data.tokenType
          this.expiresIn = data.data.expiresIn
          this.user = data.data.user

          // Save to localStorage for persistence
          if (process.client) {
            localStorage.setItem('accessToken', data.data.accessToken)
            localStorage.setItem('refreshToken', data.data.refreshToken)
            localStorage.setItem('user', JSON.stringify(data.data.user))
          }

          return {
            success: true,
            message: data.message?.en || 'Login successful'
          }
        } else {
          throw new Error(data.message?.en || data.message || 'Login failed')
        }
      } catch (error) {
        console.error('Login error:', error)
        
        // Better error handling
        let errorMessage = 'An error occurred during login'
        
        if (error.message) {
          errorMessage = error.message
        }
        
        this.error = errorMessage
        
        return {
          success: false,
          error: errorMessage
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiBase || 'http://localhost:8081'

        // Optional: Call logout API endpoint if exists
        if (this.accessToken) {
          try {
            await fetch(`${apiUrl}/api/v1/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `${this.tokenType} ${this.accessToken}`,
                'Content-Type': 'application/json',
                'accept': '*/*'
              }
            })
          } catch (err) {
            console.log('Logout API call failed, continuing with local logout')
          }
        }

        // Clear state
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        this.tokenType = 'Bearer'
        this.expiresIn = null
        this.error = null

        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }

        // Redirect to login
        await navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiBase || 'http://localhost:8081'

        const response = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken
          })
        })

        const data = await response.json()

        if (data.success && data.data) {
          this.accessToken = data.data.accessToken
          this.expiresIn = data.data.expiresIn

          if (process.client) {
            localStorage.setItem('accessToken', data.data.accessToken)
          }

          return true
        }
        return false
      } catch (error) {
        console.error('Token refresh error:', error)
        await this.logout()
        return false
      }
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const user = localStorage.getItem('user')

        if (token && user) {
          this.accessToken = token
          this.refreshToken = refreshToken
          try {
            this.user = JSON.parse(user)
          } catch (e) {
            console.error('Failed to parse user data:', e)
            this.logout()
          }
        }
      }
    },

    // Helper method to get auth headers for API calls
    getAuthHeaders() {
      return {
        'Authorization': `${this.tokenType} ${this.accessToken}`,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }
  }
})