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
    },
    authHeaders: (state) => {
      const { tokenService } = useAuthService()
      return tokenService.getAuthHeaders(state.accessToken, state.tokenType)
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const { authService, tokenService } = useAuthService()
        
        const authData = await authService.login(credentials)
        
        this._setAuthData(authData)
        tokenService.saveAuthData(authData)

        return {
          success: true,
          message: 'Login successful'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.message
        
        return {
          success: false,
          error: error.message
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const { authService, tokenService } = useAuthService()

        if (this.accessToken) {
          await authService.logout(this.accessToken, this.tokenType)
        }

        this._clearAuthData()
        tokenService.clearAuthData()

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
        const { authService, tokenService } = useAuthService()
        
        const data = await authService.refreshToken(this.refreshToken)
        console.log("Check This Data Login",data);
        
        this.accessToken = data.accessToken
        this.expiresIn = data.expiresIn

        if (process.client) {
          tokenService.storage.set('accessToken', data.accessToken)
        }

        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        await this.logout()
        return false
      }
    },

    initializeAuth() {
      if (!process.client) return

      const { tokenService } = useAuthService()
      const authData = tokenService.getAuthData()

      if (authData.accessToken && authData.user) {
        this._setAuthData({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          user: authData.user
        })
      }
    },

    // Private helper methods
    _setAuthData(data) {
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.user = data.user
      
      if (data.tokenType) this.tokenType = data.tokenType
      if (data.expiresIn) this.expiresIn = data.expiresIn
    },

    _clearAuthData() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.tokenType = 'Bearer'
      this.expiresIn = null
      this.error = null
    }
  }
})