<!-- pages/permissions/index.vue -->
<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Permissions</h2>
          <p class="text-gray-600 mt-1">Manage system permissions and access controls</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Permission
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Module Filter -->
          <div>
            <select
              v-model="moduleFilter"
              @change="fetchPermissions"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Modules</option>
              <option v-for="module in availableModules" :key="module" :value="module">
                {{ formatModuleName(module) }}
              </option>
            </select>
          </div>

          <!-- Resource Filter -->
          <div>
            <select
              v-model="resourceFilter"
              @change="fetchPermissions"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Resources</option>
              <option v-for="resource in availableResources" :key="resource" :value="resource">
                {{ resource }}
              </option>
            </select>
          </div>

          <!-- Action Filter -->
          <div>
            <select
              v-model="actionFilter"
              @change="fetchPermissions"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="READ">Read</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="relative w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="search"
            placeholder="Search permissions..."
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Loading permissions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to load permissions</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="fetchPermissions"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && permissions.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No permissions found</h3>
      <p class="text-gray-600 mb-6">Get started by creating your first permission.</p>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Create Permission
      </button>
    </div>

    <!-- Permissions Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="permission in permissions"
        :key="permission.id"
        class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {{ permission.module }}
                </span>
                <span :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full',
                  getActionColor(permission.action)
                ]">
                  {{ permission.action }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ permission.resource }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ permission.description }}
              </p>
            </div>
            <div class="relative">
              <button
                @click="togglePermissionMenu(permission.id)"
                class="p-1 hover:bg-gray-100 rounded"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="openPermissionMenu === permission.id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                @click.stop
              >
                <button
                  @click="editPermission(permission)"
                  class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Permission
                </button>
                <button
                  @click="deletePermission(permission)"
                  class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Permission
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between text-sm">
              <div class="text-gray-500">
                ID: {{ permission.id }}
              </div>
              <div class="text-gray-500">
                Created {{ formatTimeAgo(permission.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && permissions.length > 0 && totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} permissions
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div class="flex items-center space-x-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1.5 border rounded-lg text-sm',
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page + 1 }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages - 1"
          class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create/Edit Permission Modal -->
    <PermissionModal
      :show="showCreateModal || showEditModal"
      :permission="editingPermission"
      :mode="showCreateModal ? 'create' : 'edit'"
      @close="closeModal"
      @submit="handlePermissionSubmit"
    />

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Success!</h3>
          <p class="text-gray-600 mb-6">{{ successMessage }}</p>
          <button
            @click="showSuccessModal = false"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePermissionService } from '~/composables/usePermissionService'
import PermissionModal from '~/components/PermissionModal.vue'

// Services
const permissionService = usePermissionService()

// State
const permissions = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const moduleFilter = ref('')
const resourceFilter = ref('')
const actionFilter = ref('')
const currentPage = ref(0)
const itemsPerPage = ref(12)
const totalItems = ref(0)
const totalPages = ref(0)
const openPermissionMenu = ref(null)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showSuccessModal = ref(false)
const editingPermission = ref(null)
const successMessage = ref('')

// Computed
const filteredPermissions = computed(() => {
  let filtered = [...permissions.value]

  if (moduleFilter.value) {
    filtered = filtered.filter(p => p.module === moduleFilter.value)
  }

  if (resourceFilter.value) {
    filtered = filtered.filter(p => p.resource === resourceFilter.value)
  }

  if (actionFilter.value) {
    filtered = filtered.filter(p => p.action === actionFilter.value)
  }

  return filtered
})

const availableModules = computed(() => {
  const modules = new Set()
  permissions.value.forEach(p => modules.add(p.module))
  return Array.from(modules).sort()
})

const availableResources = computed(() => {
  const resources = new Set()
  permissions.value.forEach(p => resources.add(p.resource))
  return Array.from(resources).sort()
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

const startItem = computed(() => {
  const start = currentPage.value * itemsPerPage.value + 1
  return Math.min(start, totalItems.value)
})

const endItem = computed(() => {
  const end = (currentPage.value + 1) * itemsPerPage.value
  return Math.min(end, totalItems.value)
})

// Methods
async function fetchPermissions() {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: 'id',
      sortDir: 'ASC'
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    const response = await permissionService.getAllPermissions(params)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to fetch permissions')
    }

    const data = response?.data || response

    if (Array.isArray(data)) {
      permissions.value = data
      totalItems.value = data.length
      totalPages.value = Math.ceil(data.length / itemsPerPage.value)
    } else if (data.content) {
      permissions.value = data.content || []
      totalItems.value = data.totalElements || 0
      totalPages.value = data.totalPages || 0
      currentPage.value = data.number || 0
    } else {
      permissions.value = []
      totalItems.value = 0
      totalPages.value = 0
    }

  } catch (err) {
    console.error('Error fetching permissions:', err)
    error.value = err.message || 'Failed to load permissions'
  } finally {
    loading.value = false
  }
}

function formatModuleName(module) {
  if (!module) return ''
  return module.replace('_MANAGEMENT', '').replace(/_/g, ' ')
}

function getActionColor(action) {
  const colors = {
    CREATE: 'bg-green-100 text-green-800',
    READ: 'bg-blue-100 text-blue-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800'
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

function formatTimeAgo(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    fetchPermissions()
  }, 500)
}

function togglePermissionMenu(permissionId) {
  openPermissionMenu.value = openPermissionMenu.value === permissionId ? null : permissionId
}

function editPermission(permission) {
  editingPermission.value = { ...permission }
  openPermissionMenu.value = null
  showEditModal.value = true
}

async function deletePermission(permission) {
  if (!confirm(`Are you sure you want to delete permission "${permission.name}"? This action cannot be undone.`)) {
    return
  }

  try {
    loading.value = true
    const response = await permissionService.deletePermission(permission.id)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to delete permission')
    }

    successMessage.value = `Permission "${permission.name}" deleted successfully`
    showSuccessModal.value = true
    fetchPermissions()

  } catch (err) {
    console.error('Error deleting permission:', err)
    alert(err.message || 'Failed to delete permission')
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchPermissions()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchPermissions()
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchPermissions()
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingPermission.value = null
}

async function handlePermissionSubmit(permissionData, mode) {
  try {
    loading.value = true

    if (mode === 'create') {
      const response = await permissionService.createPermission(permissionData)
      if (response && response.success === false) {
        throw new Error(response.message?.en || 'Failed to create permission')
      }
      successMessage.value = 'Permission created successfully'
    } else {
      const response = await permissionService.updatePermission(permissionData.id, permissionData)
      if (response && response.success === false) {
        throw new Error(response.message?.en || 'Failed to update permission')
      }
      successMessage.value = 'Permission updated successfully'
    }

    showSuccessModal.value = true
    closeModal()
    fetchPermissions()

  } catch (err) {
    console.error('Error saving permission:', err)
    alert(err.message || `Failed to ${mode} permission`)
  } finally {
    loading.value = false
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    openPermissionMenu.value = null
  }
}

onMounted(() => {
  fetchPermissions()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>