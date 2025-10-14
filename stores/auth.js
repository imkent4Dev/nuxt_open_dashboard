import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Getters
  const getUserName = computed(() => {
    return user.value?.name || 'Guest'
  })

  const getUserEmail = computed(() => {
    return user.value?.email || ''
  })

  // Actions
  const login = async (credentials) => {
    loading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        user.value = {
          id: 1,
          name: 'John Doe',
          email: 'admin@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
        isAuthenticated.value = true
        
        // Store in localStorage for persistence
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user.value))
          localStorage.setItem('isAuthenticated', 'true')
        }
        
        return { success: true }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    
    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    }
  }

  const initializeAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('user')
      const storedAuth = localStorage.getItem('isAuthenticated')
      
      if (storedUser && storedAuth === 'true') {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    // Getters
    getUserName,
    getUserEmail,
    // Actions
    login,
    logout,
    initializeAuth
  }
})