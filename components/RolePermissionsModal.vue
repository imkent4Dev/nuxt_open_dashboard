<!-- components/RolePermissionsModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100 flex-shrink-0">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Manage Permissions</h3>
          <p class="text-sm text-gray-500 mt-1">
            Assign permissions to role: <span class="font-semibold text-blue-600">{{ formatRoleName(role.name) }}</span>
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loadingPermissions || loadingRolePermissions" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p class="mt-4 text-gray-600">{{ loadingPermissions ? 'Loading permissions...' : 'Loading role permissions...' }}</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button
              @click="fetchData"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="h-full flex">
          <!-- Left Panel - Module Navigation -->
          <div class="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div class="p-4">
              <div class="mb-6">
                <div class="relative">
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
                    class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <button
                  @click="selectModule('all')"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                    selectedModule === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>All Permissions</span>
                    <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {{ totalPermissionsCount }}
                    </span>
                  </div>
                </button>

                <div v-for="module in modules" :key="module.name" class="space-y-1">
                  <button
                    @click="selectModule(module.name)"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition',
                      selectedModule === module.name
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ formatModuleName(module.name) }}</span>
                      <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {{ module.count }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Permissions Grid -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-6">
              <!-- Module Header -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ selectedModule === 'all' ? 'All Permissions' : formatModuleName(selectedModule) }}
                </h4>
                <div class="flex items-center text-sm text-gray-600">
                  <div class="mr-4">
                    <span class="font-medium text-green-600">{{ selectedPermissionsCount }}</span>
                    selected
                  </div>
                  <div class="mr-4">
                    <span class="font-medium text-gray-900">{{ filteredPermissions.length }}</span>
                    permissions
                  </div>
                  <div class="flex-1"></div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="selectAll"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Select All
                    </button>
                    <span class="text-gray-300">|</span>
                    <button
                      @click="clearAll"
                      class="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              <!-- Permissions Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="permission in filteredPermissions"
                  :key="permission.id"
                  @click="togglePermission(permission.id)"
                  :class="[
                    'border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-blue-300 flex items-start',
                    selectedPermissionIds.includes(permission.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:shadow-md'
                  ]"
                >
                  <!-- Checkbox -->
                  <div class="mr-4 mt-1">
                    <div class="relative">
                      <input
                        type="checkbox"
                        :checked="selectedPermissionIds.includes(permission.id)"
                        class="sr-only"
                        @change="togglePermission(permission.id)"
                      >
                      <div :class="[
                        'w-5 h-5 border rounded flex items-center justify-center',
                        selectedPermissionIds.includes(permission.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 bg-white'
                      ]">
                        <svg
                          v-if="selectedPermissionIds.includes(permission.id)"
                          class="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Permission Info -->
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="text-sm font-semibold text-gray-900">
                            {{ permission.resource }}
                          </span>
                          <span :class="[
                            'px-2 py-0.5 text-xs font-medium rounded-full',
                            getActionColor(permission.action)
                          ]">
                            {{ permission.action }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-500 mb-1">
                          {{ permission.name }}
                        </div>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ permission.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No permissions found</h3>
                <p class="text-gray-600">
                  {{
                    selectedModule === 'all' 
                      ? 'No permissions match your search criteria'
                      : `No permissions found in ${formatModuleName(selectedModule)} module`
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 px-8 py-6 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span class="font-medium text-green-600">{{ selectedPermissionIds.length }}</span>
            permissions selected out of 
            <span class="font-medium text-gray-900">{{ totalPermissionsCount }}</span>
          </div>
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              @click="savePermissions"
              :disabled="saving || !hasChanges"
              :class="[
                'px-6 py-3 rounded-lg font-medium flex items-center',
                (!saving && hasChanges)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              <svg v-if="saving" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { usePermissionService } from '~/composables/usePermissionService'
import { useRoleService } from '~/composables/useRoleService'

const props = defineProps({
  show: Boolean,
  role: Object
})

const emit = defineEmits(['close', 'update'])

// Services
const permissionService = usePermissionService()
const roleService = useRoleService()

// State
const allPermissions = ref([])
const loadingPermissions = ref(false)
const loadingRolePermissions = ref(false)
const saving = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedModule = ref('all')
const selectedPermissionIds = ref([])
const initialPermissionIds = ref([])

// Computed
const filteredPermissions = computed(() => {
  let filtered = [...allPermissions.value]

  // Filter by module
  if (selectedModule.value !== 'all') {
    filtered = filtered.filter(p => p.module === selectedModule.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.resource.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    )
  }

  // Sort by resource, then action
  return filtered.sort((a, b) => {
    if (a.resource === b.resource) {
      return a.action.localeCompare(b.action)
    }
    return a.resource.localeCompare(b.resource)
  })
})

const modules = computed(() => {
  const moduleMap = new Map()
  
  allPermissions.value.forEach(permission => {
    const moduleName = permission.module
    if (!moduleMap.has(moduleName)) {
      moduleMap.set(moduleName, {
        name: moduleName,
        count: 0
      })
    }
    moduleMap.get(moduleName).count++
  })
  
  return Array.from(moduleMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const totalPermissionsCount = computed(() => allPermissions.value.length)
const selectedPermissionsCount = computed(() => selectedPermissionIds.value.length)

const hasChanges = computed(() => {
  const current = [...selectedPermissionIds.value].sort()
  const initial = [...initialPermissionIds.value].sort()
  
  if (current.length !== initial.length) return true
  
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== initial[i]) return true
  }
  
  return false
})

// Methods
function formatRoleName(roleName) {
  if (!roleName) return ''
  return roleName.replace('ROLE_', '').replace(/_/g, ' ')
}

function formatModuleName(moduleName) {
  if (!moduleName) return ''
  return moduleName.replace('_MANAGEMENT', '').replace(/_/g, ' ')
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

async function fetchAllPermissions() {
  try {
    loadingPermissions.value = true
    const response = await permissionService.getAllPermissions()

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to fetch permissions')
    }

    const data = response?.data || response

    if (Array.isArray(data)) {
      allPermissions.value = data
    } else if (data.content) {
      allPermissions.value = data.content || []
    } else {
      allPermissions.value = []
    }

  } catch (err) {
    console.error('Error fetching permissions:', err)
    error.value = err.message || 'Failed to load permissions'
  } finally {
    loadingPermissions.value = false
  }
}

async function fetchRolePermissions() {
  try {
    loadingRolePermissions.value = true
    const response = await roleService.getRolePermissions(props.role.id)

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to fetch role permissions')
    }

    const data = response?.data || response
    const permissions = Array.isArray(data) ? data : data.content || []

    selectedPermissionIds.value = permissions.map(p => p.id)
    initialPermissionIds.value = [...selectedPermissionIds.value]

  } catch (err) {
    console.error('Error fetching role permissions:', err)
    error.value = err.message || 'Failed to load role permissions'
  } finally {
    loadingRolePermissions.value = false
  }
}

async function fetchData() {
  error.value = ''
  await Promise.all([
    fetchAllPermissions(),
    fetchRolePermissions()
  ])
}

function selectModule(moduleName) {
  selectedModule.value = moduleName
}

function togglePermission(permissionId) {
  const index = selectedPermissionIds.value.indexOf(permissionId)
  if (index > -1) {
    selectedPermissionIds.value.splice(index, 1)
  } else {
    selectedPermissionIds.value.push(permissionId)
  }
}

function selectAll() {
  const permissionIds = filteredPermissions.value.map(p => p.id)
  permissionIds.forEach(id => {
    if (!selectedPermissionIds.value.includes(id)) {
      selectedPermissionIds.value.push(id)
    }
  })
}

function clearAll() {
  const permissionIds = filteredPermissions.value.map(p => p.id)
  selectedPermissionIds.value = selectedPermissionIds.value.filter(
    id => !permissionIds.includes(id)
  )
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Just update the filtered list, no API call needed
  }, 300)
}

async function savePermissions() {
  if (!hasChanges.value) {
    emit('close')
    return
  }

  try {
    saving.value = true
    const response = await roleService.updateRolePermissions(
      props.role.id,
      selectedPermissionIds.value
    )

    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to update role permissions')
    }

    emit('update', selectedPermissionIds.value)
    emit('close')

  } catch (err) {
    console.error('Error saving role permissions:', err)
    alert(err.message || 'Failed to save permissions')
  } finally {
    saving.value = false
  }
}

function reset() {
  allPermissions.value = []
  selectedPermissionIds.value = []
  initialPermissionIds.value = []
  selectedModule.value = 'all'
  searchQuery.value = ''
  error.value = ''
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal && props.role) {
    reset()
    fetchData()
  }
})

watch(() => props.role, (newVal) => {
  if (props.show && newVal) {
    reset()
    fetchData()
  }
}, { deep: true })
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>