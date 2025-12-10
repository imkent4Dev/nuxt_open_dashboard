// composables/useUsers.js
import { ref, computed } from 'vue'
import { useUserService } from '~/composables/useUserService'
import { useAuthStore } from '~/stores/auth'

export const useUsers = () => {
  const userService = useUserService()
  const authStore = useAuthStore()

  // State
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(0)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)
  const totalPages = ref(0)
  const searchQuery = ref('')

  // Computed
  const paginatedData = computed(() => users.value)

  const displayedPages = computed(() => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage.value - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    if (endPage >= totalPages.value) {
      endPage = totalPages.value - 1
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= 0 && i < totalPages.value) {
        pages.push(i)
      }
    }

    return pages
  })

  const startItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value + 1, totalItems.value)
  })

  const endItem = computed(() => {
    return Math.min((currentPage.value + 1) * itemsPerPage.value, totalItems.value)
  })

  // Methods
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = null

      const params = {
        page: currentPage.value,
        size: itemsPerPage.value,
        sortBy: 'id',
        sortDir: 'DESC'
      }

      if (searchQuery.value.trim()) {
        params.search = searchQuery.value.trim()
      }

      const data = await userService.getUsers(params)

      if (data.success) {
        users.value = data.data.content
        totalItems.value = data.data.totalElements
        totalPages.value = data.data.totalPages
        currentPage.value = data.data.number
      } else {
        throw new Error(data.message?.en || 'Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      error.value = err.message || 'Failed to load users'

      // Handle unauthorized
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        await authStore.logout()
      }
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      loading.value = true
      error.value = null

      await userService.createUser(userData)
      await fetchUsers() // Refresh list

      return { success: true }
    } catch (err) {
      console.error('Error creating user:', err)
      error.value = err.message || 'Failed to create user'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    try {
      loading.value = true
      error.value = null

      await userService.updateUser(id, userData)
      await fetchUsers() // Refresh list

      return { success: true }
    } catch (err) {
      console.error('Error updating user:', err)
      error.value = err.message || 'Failed to update user'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    try {
      loading.value = true
      error.value = null

      await userService.deleteUser(id)
      await fetchUsers() // Refresh list

      return { success: true }
    } catch (err) {
      console.error('Error deleting user:', err)
      error.value = err.message || 'Failed to delete user'
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const searchUsers = (query) => {
    searchQuery.value = query
    currentPage.value = 0
    fetchUsers()
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++
      fetchUsers()
    }
  }

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--
      fetchUsers()
    }
  }

  const goToPage = (page) => {
    currentPage.value = page
    fetchUsers()
  }

  const changePageSize = (size) => {
    itemsPerPage.value = size
    currentPage.value = 0
    fetchUsers()
  }

  return {
    // State
    users,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    searchQuery,

    // Computed
    paginatedData,
    displayedPages,
    startItem,
    endItem,

    // Methods
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    nextPage,
    prevPage,
    goToPage,
    changePageSize
  }
}