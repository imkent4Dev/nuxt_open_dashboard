<!-- pages/roles/index.vue -->
<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Roles</h2>
          <p class="text-gray-600 mt-1">Manage system roles and their permissions</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Role
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div class="flex justify-end">
        <div class="relative w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="search"
            placeholder="Search roles..."
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Loading roles...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to load roles</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="fetchRoles"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && roles.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No roles found</h3>
      <p class="text-gray-600 mb-6">Get started by creating your first role.</p>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Create Role
      </button>
    </div>

    <!-- Roles Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="role in filteredRoles" 
              :key="role.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatRoleName(role.name) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ role.id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-md">{{ role.description }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="text-sm text-gray-900 mr-2">
                    {{ role.permissions?.length || 0 }}
                  </div>
                  <button
                    @click="viewRolePermissions(role)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  role.isSystemRole 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ role.isSystemRole ? 'System' : 'Custom' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(role.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3">
                  <button
                    @click="editRole(role)"
                    :disabled="role.isSystemRole"
                    :class="[
                      'text-blue-600 hover:text-blue-900',
                      role.isSystemRole ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    Edit
                  </button>
                  <button
                    @click="manageRolePermissions(role)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Permissions
                  </button>
                  <button
                    @click="deleteRole(role)"
                    :disabled="role.isSystemRole"
                    :class="[
                      'text-red-600 hover:text-red-900',
                      role.isSystemRole ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && roles.length > 0 && totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} roles
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

    <!-- Create/Edit Role Modal -->
    <RoleModal
      :show="showCreateModal || showEditModal"
      :role="editingRole"
      :mode="showCreateModal ? 'create' : 'edit'"
      @close="closeModal"
      @submit="handleRoleSubmit"
    />

    <!-- Role Permissions Modal -->
    <RolePermissionsModal
      :show="showPermissionsModal"
      :role="selectedRole"
      @close="closePermissionsModal"
      @update="handlePermissionsUpdate"
    />

    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      :title="successTitle"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoleService } from '~/composables/useRoleService'
import RoleModal from '~/components/RoleModal.vue'
import RolePermissionsModal from '~/components/RolePermissionsModal.vue'
import SuccessModal from '~/components/SuccessModal.vue'

// Services
const roleService = useRoleService()

// State
const roles = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const currentPage = ref(0)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionsModal = ref(false)
const showSuccessModal = ref(false)
const editingRole = ref(null)
const selectedRole = ref(null)
const successTitle = ref('')
const successMessage = ref('')

// Computed
const filteredRoles = computed(() => {
  if (!searchQuery.value.trim()) return roles.value
  
  const searchTerm = searchQuery.value.toLowerCase().trim()
  return roles.value.filter(role => 
    role.name.toLowerCase().includes(searchTerm) ||
    role.description.toLowerCase().includes(searchTerm)
  )
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
async function fetchRoles() {
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

    const response = await roleService.getAllRoles(params)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to fetch roles')
    }

    const data = response?.data || response

    if (Array.isArray(data)) {
      roles.value = data
      totalItems.value = data.length
      totalPages.value = Math.ceil(data.length / itemsPerPage.value)
    } else if (data.content) {
      roles.value = data.content || []
      totalItems.value = data.totalElements || 0
      totalPages.value = data.totalPages || 0
      currentPage.value = data.number || 0
    } else {
      roles.value = []
      totalItems.value = 0
      totalPages.value = 0
    }

  } catch (err) {
    console.error('Error fetching roles:', err)
    error.value = err.message || 'Failed to load roles'
  } finally {
    loading.value = false
  }
}

function formatRoleName(roleName) {
  if (!roleName) return ''
  return roleName.replace('ROLE_', '').replace(/_/g, ' ')
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    fetchRoles()
  }, 500)
}

function editRole(role) {
  if (role.isSystemRole) return
  editingRole.value = { ...role }
  showEditModal.value = true
}

async function deleteRole(role) {
  if (role.isSystemRole) {
    alert('System roles cannot be deleted')
    return
  }

  if (!confirm(`Are you sure you want to delete role "${formatRoleName(role.name)}"? This action cannot be undone.`)) {
    return
  }

  try {
    loading.value = true
    const response = await roleService.deleteRole(role.id)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to delete role')
    }

    successTitle.value = 'Success!'
    successMessage.value = `Role "${formatRoleName(role.name)}" deleted successfully`
    showSuccessModal.value = true
    fetchRoles()

  } catch (err) {
    console.error('Error deleting role:', err)
    alert(err.message || 'Failed to delete role')
  } finally {
    loading.value = false
  }
}

function viewRolePermissions(role) {
  selectedRole.value = { ...role }
  // You could create a view-only modal here
  alert(`Permissions for ${formatRoleName(role.name)}:\n${role.permissions?.length || 0} permissions`)
}

function manageRolePermissions(role) {
  selectedRole.value = { ...role }
  showPermissionsModal.value = true
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchRoles()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchRoles()
  }
}

function goToPage(page) {
  currentPage.value = page
  fetchRoles()
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingRole.value = null
}

function closePermissionsModal() {
  showPermissionsModal.value = false
  selectedRole.value = null
}

async function handleRoleSubmit(roleData, mode) {
  try {
    loading.value = true

    if (mode === 'create') {
      const response = await roleService.createRole(roleData)
      if (response && response.success === false) {
        throw new Error(response.message?.en || 'Failed to create role')
      }
      successTitle.value = 'Success!'
      successMessage.value = 'Role created successfully'
    } else {
      const response = await roleService.updateRole(roleData.id, roleData)
      if (response && response.success === false) {
        throw new Error(response.message?.en || 'Failed to update role')
      }
      successTitle.value = 'Success!'
      successMessage.value = 'Role updated successfully'
    }

    showSuccessModal.value = true
    closeModal()
    fetchRoles()

  } catch (err) {
    console.error('Error saving role:', err)
    alert(err.message || `Failed to ${mode} role`)
  } finally {
    loading.value = false
  }
}

async function handlePermissionsUpdate(permissionIds) {
  try {
    loading.value = true
    const response = await roleService.updateRolePermissions(selectedRole.value.id, permissionIds)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to update role permissions')
    }

    successTitle.value = 'Success!'
    successMessage.value = `Permissions updated for role "${formatRoleName(selectedRole.value.name)}"`
    showSuccessModal.value = true
    closePermissionsModal()
    fetchRoles()

  } catch (err) {
    console.error('Error updating role permissions:', err)
    alert(err.message || 'Failed to update role permissions')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRoles()
})
</script>