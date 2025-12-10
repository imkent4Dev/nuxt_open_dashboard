<!-- ~/components/EditUserModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? 'Edit User' : 'View User' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-600">{{ isEditMode ? 'Loading user data...' : 'Loading user details...' }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-500 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-600 font-semibold">{{ error }}</p>
          <button @click="fetchUser" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Retry
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- User Information Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column - Basic Info -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900 border-b pb-2">Basic Information</h4>
              
              <!-- User ID (Readonly) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input 
                  :value="user.id" 
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <!-- Username (Readonly) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  :value="user.username" 
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  v-model="formData.firstName"
                  :readonly="!isEditMode"
                  :class="[
                    'w-full px-3 py-2 border rounded-md',
                    isEditMode 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  ]"
                  required
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  v-model="formData.lastName"
                  :readonly="!isEditMode"
                  :class="[
                    'w-full px-3 py-2 border rounded-md',
                    isEditMode 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  ]"
                  required
                />
              </div>
            </div>

            <!-- Right Column - Contact & Status -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-gray-900 border-b pb-2">Contact & Status</h4>
              
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="formData.email"
                  type="email"
                  :readonly="!isEditMode"
                  :class="[
                    'w-full px-3 py-2 border rounded-md',
                    isEditMode 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  ]"
                  required
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  v-model="formData.phoneNumber"
                  type="tel"
                  :readonly="!isEditMode"
                  :class="[
                    'w-full px-3 py-2 border rounded-md',
                    isEditMode 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  ]"
                />
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div v-if="isEditMode" class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.isActive" 
                      :value="true"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.isActive" 
                      :value="false"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
                <div v-else>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>

              <!-- Created At (Readonly) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                <input 
                  :value="formatDate(user.createdAt)" 
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          <!-- Role and Permission Section -->
          <div class="border-t pt-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Role & Permissions</h4>
            
            <!-- Loading roles -->
            <div v-if="loadingRoles" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p class="mt-2 text-sm text-gray-600">Loading roles...</p>
            </div>

            <!-- Role Selection -->
            <div v-else class="space-y-4">
              <!-- Role Dropdown -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Roles
                  <span class="text-xs text-gray-500">(User can have multiple roles)</span>
                </label>
                <div class="flex flex-wrap gap-2 mb-4">
                  <div v-for="role in allRoles" :key="role.id" class="relative">
                    <input
                      :id="`role-${role.id}`"
                      type="checkbox"
                      v-model="selectedRoleIds"
                      :value="role.id"
                      :disabled="!isEditMode || role.isSystemRole"
                      class="sr-only peer"
                    />
                    <label 
                      :for="`role-${role.id}`"
                      :class="[
                        'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all',
                        selectedRoleIds.includes(role.id)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100',
                        (!isEditMode || role.isSystemRole) ? 'opacity-60 cursor-not-allowed' : ''
                      ]"
                    >
                      {{ role.name.replace('ROLE_', '') }}
                      <span v-if="role.isSystemRole" class="ml-2 text-xs text-gray-500">(System)</span>
                    </label>
                  </div>
                </div>
                
                <!-- Current Roles Display (Readonly for view mode) -->
                <div v-if="!isEditMode && user.roles?.length > 0">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="role in user.roles" 
                      :key="role.id"
                      class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {{ role.name.replace('ROLE_', '') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Permissions Preview -->
              <div v-if="selectedRoleIds.length > 0">
                <div class="flex items-center justify-between mb-3">
                  <label class="text-sm font-medium text-gray-700">
                    Assigned Permissions
                    <span class="text-xs text-gray-500">(Based on selected roles)</span>
                  </label>
                  <span class="text-xs text-gray-500">
                    {{ totalSelectedPermissions }} permissions
                  </span>
                </div>
                
                <!-- Grouped Permissions -->
                <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div v-for="module in groupedPermissions" :key="module.name" class="mb-4 last:mb-0">
                    <div class="flex items-center justify-between mb-2">
                      <h5 class="text-sm font-medium text-gray-900">
                        {{ formatModuleName(module.name) }}
                      </h5>
                      <span class="text-xs text-gray-500">
                        {{ module.permissions.length }} permissions
                      </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div 
                        v-for="permission in module.permissions" 
                        :key="permission.id"
                        class="flex items-center p-2 bg-white rounded border"
                      >
                        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-900">
                            {{ formatPermissionName(permission.name) }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ permission.description }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- No permissions warning -->
                  <div v-if="totalSelectedPermissions === 0" class="text-center py-4">
                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L6.782 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <p class="text-sm text-gray-600">Selected roles have no permissions</p>
                  </div>
                </div>
              </div>
              
              <!-- No roles selected -->
              <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9A5.5 5.5 0 0012 3.5 5.5 5.5 0 006.5 9c0 1.43.56 2.74 1.47 3.7"></path>
                </svg>
                <p class="text-sm text-gray-600">No roles selected. Select roles to view permissions.</p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-white pt-6 border-t">
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="$emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                v-if="isEditMode"
                type="submit" 
                :disabled="submitting"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-lg transition',
                  submitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
              >
                <span v-if="submitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>
                  Save Changes
                </span>
              </button>
              <button 
                v-else
                type="button" 
                @click="enableEditMode"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Edit User
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userId: {
    type: [Number, String],
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update', 'success'])

// Services
const userService = useUserService()
const roleService = useRoleService()

// State
const user = ref({})
const formData = ref({})
const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const isEditing = ref(props.isEditMode)

// Role management
const allRoles = ref([])
const loadingRoles = ref(false)
const selectedRoleIds = ref([])

// Computed properties
const selectedRoles = computed(() => {
  return allRoles.value.filter(role => selectedRoleIds.value.includes(role.id))
})

const allSelectedPermissions = computed(() => {
  const permissions = new Map()
  selectedRoles.value.forEach(role => {
    if (role.permissions && Array.isArray(role.permissions)) {
      role.permissions.forEach(permission => {
        if (!permissions.has(permission.id)) {
          permissions.set(permission.id, permission)
        }
      })
    }
  })
  return Array.from(permissions.values())
})

const totalSelectedPermissions = computed(() => allSelectedPermissions.value.length)

const groupedPermissions = computed(() => {
  const groups = new Map()
  
  allSelectedPermissions.value.forEach(permission => {
    const module = permission.module || 'OTHER'
    if (!groups.has(module)) {
      groups.set(module, {
        name: module,
        permissions: []
      })
    }
    groups.get(module).permissions.push(permission)
  })
  
  return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// Methods
const fetchUser = async () => {
  if (!props.userId) return
  
  try {
    loading.value = true
    error.value = null
    
    const response = await userService.getUserById(props.userId)
    
    // Check for errors in the response
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to fetch user')
    }

    const userData = response?.data || response
    
    if (userData) {
      user.value = userData
      // Initialize form data
      formData.value = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        isActive: userData.isActive || false
      }
      
      // Initialize selected roles
      if (userData.roles && Array.isArray(userData.roles)) {
        selectedRoleIds.value = userData.roles.map(role => role.id)
      }
    } else {
      throw new Error('No user data received')
    }
  } catch (err) {
    console.error('Error fetching user:', err)
    error.value = err.message || 'Failed to load user details'
  } finally {
    loading.value = false
  }
}

const fetchAllRoles = async () => {
  try {
    loadingRoles.value = true
    const response = await roleService.getAllRoles()
    
    if (response && response.success === false) {
      console.error('Failed to fetch roles:', response.message)
      allRoles.value = []
      return
    }
    
    const rolesData = response?.data || response
    
    if (Array.isArray(rolesData)) {
      allRoles.value = rolesData
    } else {
      allRoles.value = []
    }
  } catch (err) {
    console.error('Error fetching roles:', err)
    allRoles.value = []
  } finally {
    loadingRoles.value = false
  }
}

const handleSubmit = async () => {
  if (!isEditing.value) return
  
  try {
    submitting.value = true
    
    // Prepare user data with roles
    const userUpdateData = {
      ...formData.value,
      roleIds: selectedRoleIds.value
    }
    
    const response = await userService.updateUser(props.userId, userUpdateData)
    
    // Check for errors in the response
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to update user')
    }

    emit('success', {
      message: 'User updated successfully',
      user: response?.data || response
    })
    emit('close')
  } catch (err) {
    console.error('Error updating user:', err)
    alert(err.message || 'Failed to update user')
  } finally {
    submitting.value = false
  }
}

const enableEditMode = () => {
  isEditing.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

const formatModuleName = (moduleName) => {
  if (!moduleName) return 'Other'
  return moduleName
    .replace(/_/g, ' ')
    .replace(/_MANAGEMENT$/, '')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatPermissionName = (permissionName) => {
  if (!permissionName) return ''
  const parts = permissionName.split('_')
  if (parts.length < 2) return permissionName
  const action = parts[0]
  const resource = parts.slice(1).join(' ')
  return `${action} ${resource}`
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal && props.userId) {
    fetchUser()
    fetchAllRoles()
    // Reset to prop mode when modal opens
    isEditing.value = props.isEditMode
  }
})

watch(() => props.userId, (newVal) => {
  if (props.show && newVal) {
    fetchUser()
  }
})

// Fetch roles on component mount
onMounted(() => {
  fetchAllRoles()
})
</script>

<style scoped>
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