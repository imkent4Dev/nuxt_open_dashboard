<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center 
         bg-black/30 backdrop-blur-sm z-50">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-3xl">
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <h3 class="text-lg font-semibold">Add New User</h3>
        <button @click="closeModal" class="text-red-500 hover:text-red-700 text-xl">
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-600">Creating user...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-600 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Form Content -->
        <div v-else>
          <!-- Section -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-semibold mb-1">User Information</h4>
            <p class="text-sm text-gray-500">
              Please input following information
            </p>
          </div>

          <!-- Form Fields -->
          <div class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-3">Personal Information</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInputField 
                  v-model="form.firstName" 
                  label="First Name" 
                  required 
                  :disabled="loading"
                  placeholder="Enter first name"
                />
                <BaseInputField 
                  v-model="form.lastName" 
                  label="Last Name" 
                  required 
                  :disabled="loading"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <!-- Account Information -->
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-3">Account Information</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInputField 
                  v-model="form.username" 
                  label="Username" 
                  required 
                  :disabled="loading"
                  placeholder="Enter username"
                />
                <BaseInputField 
                  v-model="form.email" 
                  label="Email" 
                  type="email"
                  required 
                  :disabled="loading"
                  placeholder="Enter email address"
                />
              </div>
              <div class="mt-4">
                <BaseInputField 
                  v-model="form.password" 
                  label="Password" 
                  type="password"
                  required 
                  :disabled="loading"
                  placeholder="Enter password"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-3">Contact Information</h5>
              <BaseInputField 
                v-model="form.phoneNumber" 
                label="Phone Number" 
                required 
                :disabled="loading"
                placeholder="Enter phone number"
              />
            </div>

            <!-- Additional Information -->
            <div>
              <h5 class="text-sm font-medium text-gray-700 mb-3">Additional Information</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Roles (This would typically be a select dropdown from API) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Roles <span class="text-red-500">*</span>
                  </label>
                  <select 
                    v-model="form.roleIds[0]"
                    :disabled="loading"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>Select a role</option>
                    <option value="1">Super Admin</option>
                    <option value="2">Admin</option>
                    <option value="3">Manager</option>
                    <option value="4">User</option>
                  </select>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="form.isActive" 
                        :value="true"
                        :disabled="loading"
                        class="mr-2"
                      >
                      <span class="text-sm">Active</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="form.isActive" 
                        :value="false"
                        :disabled="loading"
                        class="mr-2"
                      >
                      <span class="text-sm">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-4 border-t">
        <button 
          @click="closeModal" 
          :disabled="loading"
          class="px-6 py-2 mr-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit" 
          :disabled="loading || !isFormValid"
          class="px-6 py-2 rounded-lg shadow text-white btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create User</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseInputField from '~/components/UI/BaseInputField.vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'submit'])

// API Configuration
const API_BASE_URL = 'http://localhost:8081/api/v1/users'
const AUTH_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NTI3MjYwNCwiZXhwIjoxNzY1MzU5MDA0fQ.LQQfaX4Ahi6TU2B4RznF_BdTD3LuK6o9-268uMa8Pt2oa5j0JV-tyqptUGJyy56O'

// Form state
const form = reactive({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  roleIds: [4], // Default to ROLE_USER (ID: 4 based on your API response)
  isActive: true
})

// UI state
const loading = ref(false)
const error = ref('')

// Validation
const isFormValid = computed(() => {
  return (
    form.username.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phoneNumber.trim() &&
    form.roleIds[0] &&
    validateEmail(form.email) &&
    validatePassword(form.password)
  )
})

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

// API call to create user
async function createUser() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message?.en || `HTTP error! status: ${response.status}`)
    }

    if (data.success) {
      // Success - emit submit event with the created user data
      emit('submit', data.data || form)
      
      // Reset form
      resetForm()
      
      // Close modal
      emit('close')
    } else {
      throw new Error(data.message?.en || 'Failed to create user')
    }
  } catch (err) {
    console.error('Error creating user:', err)
    error.value = err.message || 'Failed to create user. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleSubmit() {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly'
    return
  }

  createUser()
}

function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.firstName = ''
  form.lastName = ''
  form.phoneNumber = ''
  form.roleIds = [4]
  form.isActive = true
  error.value = ''
}

function closeModal() {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}

// Watch for modal close and reset form
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(90deg, #4b6cb7, #182848);
}

.btn-gradient:hover:not(:disabled) {
  background: linear-gradient(90deg, #3a5ca9, #0f1f3d);
}

/* Loading spinner animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>