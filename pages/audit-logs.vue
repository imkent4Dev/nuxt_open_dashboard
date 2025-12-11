<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p class="text-gray-600 mt-1">Monitor system activities and user actions</p>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="exportLogs" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
            Export
          </button>
          <button @click="refresh" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Logs</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalItems }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Success Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ successRate }}%</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Unique Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Last 24h</p>
            <p class="text-2xl font-bold text-gray-900">{{ logsLast24h }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="relative">
            <input v-model="searchQuery" 
                   @input="handleSearch"
                   type="text" 
                   placeholder="Search by user, action, or details..." 
                   class="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <select v-model="selectedAction" @change="applyFilters" class="px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
            <option value="">All Actions</option>
            <option v-for="action in actionTypes" :key="action" :value="action">{{ action }}</option>
          </select>
          
          <select v-model="selectedStatus" @change="applyFilters" class="px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
            <option value="">All Status</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
          
          <select v-model="itemsPerPage" @change="handlePageSizeChange" class="px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p class="mt-3 text-gray-600">Loading audit logs...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
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

      <!-- Data Table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-gray-50 transition-colors cursor-pointer" @click="viewLogDetails(log)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900">#{{ log.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDateTime(log.timestamp) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTimeAgo(log.timestamp) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div :class="['flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center', getUserColor(log.username)]">
                      <span class="text-sm font-medium text-white">{{ getInitials(log.username || 'Unknown') }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ log.username || 'Unknown User' }}</div>
                      <div class="text-xs text-gray-500">ID: {{ log.userId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getActionClass(log.action)]">
                      {{ log.action }}
                    </span>
                    <div class="ml-2 text-xs text-gray-500">{{ log.resource }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 line-clamp-2">{{ log.details }}</div>
                  <div v-if="log.ipAddress" class="text-xs text-gray-500 mt-1">{{ log.ipAddress }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ log.success ? 'Success' : 'Failed' }}
                    </span>
                    <div v-if="log.errorMessage" class="ml-2 text-xs text-red-600 max-w-xs truncate" :title="log.errorMessage">
                      {{ log.errorMessage }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="!loading && auditLogs.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No audit logs found</h3>
            <p class="mt-1 text-gray-500">Try adjusting your filters or create some activity</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && auditLogs.length > 0" class="px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ totalItems }}</span> logs
            </div>
            
            <div class="flex items-center space-x-2">
              <button @click="goToPage(0)" :disabled="currentPage === 0"
                class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                First
              </button>
              
              <button @click="prevPage" :disabled="currentPage === 0"
                class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              
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
              
              <button @click="nextPage" :disabled="currentPage === totalPages - 1 || totalPages === 0"
                class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
              
              <button @click="goToPage(totalPages - 1)" :disabled="currentPage === totalPages - 1 || totalPages === 0"
                class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Audit Log Details</h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <div class="space-y-6">
            <!-- Basic Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Log ID</p>
                  <p class="text-sm font-medium text-gray-900">#{{ selectedLog.id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Timestamp</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDateTime(selectedLog.timestamp) }}</p>
                </div>
              </div>
            </div>

            <!-- User Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">User Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">User ID</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedLog.userId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Username</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedLog.username || 'Unknown' }}</p>
                </div>
              </div>
            </div>

            <!-- Action Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Action Details</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Action</p>
                  <span :class="['px-2 py-1 text-xs font-semibold rounded', getActionClass(selectedLog.action)]">
                    {{ selectedLog.action }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Resource</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedLog.resource }} <span v-if="selectedLog.resourceId">(ID: {{ selectedLog.resourceId }})</span></p>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-xs text-gray-500">Details</p>
                <p class="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{{ selectedLog.details }}</p>
              </div>
            </div>

            <!-- Technical Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-2">Technical Information</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500">IP Address</p>
                  <p class="text-sm font-mono text-gray-900">{{ selectedLog.ipAddress }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">User Agent</p>
                  <p class="text-sm text-gray-900 break-words">{{ selectedLog.userAgent }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <span :class="['px-2 py-1 text-xs font-semibold rounded', selectedLog.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ selectedLog.success ? 'Success' : 'Failed' }}
                  </span>
                  <p v-if="selectedLog.errorMessage" class="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                    Error: {{ selectedLog.errorMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button @click="selectedLog = null" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { useAuditLogService } from '~/composables/useAuditLogService'

const router = useRouter()
const authStore = useAuthStore()
const auditService = useAuditLogService()

// State
const auditLogs = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(0)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)
const selectedLog = ref(null)
const selectedAction = ref('')
const selectedStatus = ref('')

// Constants
const actionTypes = ref(['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'READ'])

// Fetch audit logs
async function fetchAuditLogs() {
  try {
    loading.value = true
    error.value = null

    //console.log('🚀 Starting fetchAuditLogs...')
    //console.log('📱 Current auth token:', authStore.token ? 'Present' : 'Missing')
    //console.log('🔍 Audit service:', auditService ? 'Available' : 'Missing')

    const params = {
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: 'timestamp',
      sortDir: 'DESC'
    }

    console.log('📋 Request params:', params)

    // Add search
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
      //console.log('🔍 Search query:', searchQuery.value.trim())
    }

    // Add filters
    if (selectedAction.value) {
      params.action = selectedAction.value
      //console.log('🎯 Action filter:', selectedAction.value)
    }
    if (selectedStatus.value !== '') {
      params.success = selectedStatus.value
      //console.log('✅ Status filter:', selectedStatus.value)
    }

    //console.log('📤 Final params:', params)

    // Make API call
    const response = await auditService.getAuditLogs(params)
    
    //console.log('📥 Raw API response:', response)
    
    if (response && response.success) {
      console.log('✅ API call successful')
      
      auditLogs.value = response.data.content || []
      totalItems.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 0
      currentPage.value = response.data.number || 0
      
      // console.log('📊 Processed data:', {
      //   logsCount: auditLogs.value.length,
      //   totalItems: totalItems.value,
      //   totalPages: totalPages.value,
      //   currentPage: currentPage.value
      // })
    } else {
      console.error('❌ API returned failure:', response)
      throw new Error(response?.message?.en || response?.message || 'Failed to fetch audit logs')
    }
  } catch (err) {
    // console.error('💥 Error in fetchAuditLogs:', err)
    // console.error('📊 Error object:', {
    //   name: err.name,
    //   message: err.message,
    //   stack: err.stack,
    //   response: err.response,
    //   status: err.response?.status,
    //   data: err.response?.data
    // })
    
    error.value = err.message || 'Failed to load audit logs. Please try again.'
    
    // Handle unauthorized
    if (err.response?.status === 401 || err.message.includes('401') || err.message.includes('Unauthorized')) {
      console.log('🔒 Unauthorized, logging out...')
      await authStore.logout()
      router.push('/login')
    }
  } finally {
    loading.value = false
    console.log('🏁 fetchAuditLogs completed')
  }
}

// Computed properties
const successRate = computed(() => {
  if (auditLogs.value.length === 0) return 0
  const successCount = auditLogs.value.filter(log => log.success).length
  return Math.round((successCount / auditLogs.value.length) * 100)
})

const uniqueUsers = computed(() => {
  const usernames = auditLogs.value.map(log => log.username).filter(Boolean)
  return new Set(usernames).size
})

const logsLast24h = computed(() => {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  return auditLogs.value.filter(log => new Date(log.timestamp) > yesterday).length
})

const startItem = computed(() => {
  const start = currentPage.value * itemsPerPage.value + 1
  return Math.min(start, totalItems.value)
})

const endItem = computed(() => {
  const end = (currentPage.value + 1) * itemsPerPage.value
  return Math.min(end, totalItems.value)
})

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

// Helper functions
function formatDateTime(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`
  
  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears}y ago`
}

function getInitials(name) {
  if (!name || name === 'Unknown') return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function getUserColor(username) {
  if (!username) return 'bg-gray-500'
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500']
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

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

// Event handlers
let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    fetchAuditLogs()
  }, 500)
}

function applyFilters() {
  currentPage.value = 0
  fetchAuditLogs()
}

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

function refresh() {
  fetchAuditLogs()
}

function viewLogDetails(log) {
  selectedLog.value = log
}

function exportLogs() {
  // Implement export functionality
  alert('Export functionality to be implemented')
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  fetchAuditLogs()
})

// Watchers
watch([currentPage, itemsPerPage], () => {
  fetchAuditLogs()
}, { immediate: false })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>