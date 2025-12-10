<template>
  <div class="p-6">
    <div class="mt-4">
      <!-- Page Title -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Audit Logs</h2>
        <p class="text-gray-600 mt-1">Track system activities and user actions</p>
      </div>

      <!-- Container -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p class="mt-3 text-gray-600">Loading audit logs...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-3">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-600 font-semibold text-lg mb-2">{{ error }}</p>
          <button @click="fetchAuditLogs" class="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
            Retry
          </button>
        </div>

        <!-- Data State -->
        <div v-else>
          <!-- Simple Search (Optional) -->
          <div class="flex justify-end mb-6">
            <div class="relative w-full md:w-64">
              <input v-model="searchQuery" type="text" placeholder="Search logs..." 
                @input="handleSearch"
                class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-mono text-gray-900">#{{ log.id }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDateTime(log.timestamp) }}</div>
                    <div class="text-xs text-gray-500">{{ formatTimeAgo(log.timestamp) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-blue-800">{{ getInitials(log.username || 'Unknown') }}</span>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ log.username || 'Unknown' }}</div>
                        <div class="text-xs text-gray-500">ID: {{ log.userId }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getActionClass(log.action)
                    ]">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ log.resource }}</div>
                    <div v-if="log.resourceId" class="text-xs text-gray-500">ID: {{ log.resourceId }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ log.details }}</div>
                    <div v-if="log.errorMessage" class="text-xs text-red-600 mt-1">{{ log.errorMessage }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-mono text-gray-900">{{ log.ipAddress }}</div>
                    <div class="text-xs text-gray-500 truncate max-w-[150px]">{{ log.userAgent }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ log.success ? 'Success' : 'Failed' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="!loading && auditLogs.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-3 text-lg font-medium text-gray-900">No audit logs found</h3>
              <p class="mt-1 text-gray-500">No audit logs available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && auditLogs.length > 0" class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <!-- Items Info -->
        <div class="text-sm text-gray-600">
          Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} logs
        </div>

        <!-- Pagination Controls -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <!-- Page Size -->
          <div>
            <select v-model="itemsPerPage" @change="handlePageSizeChange"
              class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          <!-- Page Navigation -->
          <div class="flex items-center space-x-2">
            <!-- First Page -->
            <button @click="goToPage(0)" :disabled="currentPage === 0"
              class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              «
            </button>

            <!-- Previous Page -->
            <button @click="prevPage" :disabled="currentPage === 0"
              class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              ← Prev
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
              <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" :class="[
                'px-3 py-1.5 rounded-lg border text-sm min-w-[40px]',
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-100'
              ]">
                {{ page + 1 }}
              </button>
            </div>

            <!-- Next Page -->
            <button @click="nextPage" :disabled="currentPage === totalPages - 1 || totalPages === 0"
              class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next →
            </button>

            <!-- Last Page -->
            <button @click="goToPage(totalPages - 1)" :disabled="currentPage === totalPages - 1 || totalPages === 0"
              class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { useAuditService } from '~/composables/useAuditLogService'

const router = useRouter()
const authStore = useAuthStore()

// Initialize service
const auditService = useAuditService()

// Reactive state
const auditLogs = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(0)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

// Fetch audit logs - SIMPLIFIED
async function fetchAuditLogs() {
  try {
    loading.value = true
    error.value = null

    // Simple params - just pagination and search
    const params = {
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: 'timestamp',
      sortDir: 'DESC'
    }

    // Add search query if provided
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    // Use the service
    const data = await auditService.getAuditLogs(params)

    if (data.success) {
      auditLogs.value = data.data.content || []
      totalItems.value = data.data.totalElements || 0
      totalPages.value = data.data.totalPages || 0
      currentPage.value = data.data.number || 0
    } else {
      throw new Error(data.message?.en || 'Failed to fetch audit logs')
    }
  } catch (err) {
    console.error('Error fetching audit logs:', err)
    error.value = err.message || 'Failed to load audit logs. Please try again.'
    
    // Handle unauthorized
    if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
      await authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

// Handle search with debounce
let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    fetchAuditLogs()
  }, 500)
}

// Pagination functions
function handlePageSizeChange() {
  currentPage.value = 0
  fetchAuditLogs()
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchAuditLogs()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchAuditLogs()
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchAuditLogs()
}

// Format date and time
function formatDateTime(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function formatTimeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`
}

// Get initials for avatar
function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Get action badge class
function getActionClass(action) {
  const actionClasses = {
    'LOGIN': 'bg-green-100 text-green-800',
    'LOGOUT': 'bg-gray-100 text-gray-800',
    'CREATE': 'bg-blue-100 text-blue-800',
    'UPDATE': 'bg-yellow-100 text-yellow-800',
    'DELETE': 'bg-red-100 text-red-800',
    'READ': 'bg-purple-100 text-purple-800'
  }
  return actionClasses[action] || 'bg-gray-100 text-gray-800'
}

// Computed properties
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
  const start = currentPage.value * itemsPerPage.value + 1
  return Math.min(start, totalItems.value)
})

const endItem = computed(() => {
  const end = (currentPage.value + 1) * itemsPerPage.value
  return Math.min(end, totalItems.value)
})

// Lifecycle
onMounted(() => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  fetchAuditLogs()
})

// Watch for pagination changes
watch([currentPage, itemsPerPage], () => {
  fetchAuditLogs()
}, { immediate: false })
</script>

<style scoped>
/* Optional custom styles */
</style>