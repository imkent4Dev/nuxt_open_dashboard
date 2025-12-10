<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center 
         bg-black/50 backdrop-blur-sm z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Create New User</h3>
          <p class="text-sm text-gray-500 mt-1">Add a new user to the system with specific roles and permissions</p>
        </div>
        <button 
          @click="closeModal" 
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          :disabled="loading"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
        <!-- Loading State -->
        <div v-if="loadingRoles || loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p class="mt-3 text-gray-600">{{ loadingRoles ? 'Loading roles...' : 'Creating user...' }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-100 rounded-xl p-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 class="text-red-800 font-semibold">Error</h4>
              <p class="text-red-600 text-sm mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div v-else>
          <!-- Progress Steps -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                ]">
                  1
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Basic Info</div>
                  <div class="text-xs text-gray-500">Personal details</div>
                </div>
              </div>
              
              <div class="w-8 h-0.5 bg-gray-200"></div>
              
              <div class="flex items-center">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                ]">
                  2
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Account Setup</div>
                  <div class="text-xs text-gray-500">Credentials & contact</div>
                </div>
              </div>
              
              <div class="w-8 h-0.5 bg-gray-200"></div>
              
              <div class="flex items-center">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                ]">
                  3
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">Roles</div>
                  <div class="text-xs text-gray-500">Assign permissions</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 1: Personal Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900">Personal Information</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="John"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                    formErrors.firstName ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                  ]"
                  @input="clearError('firstName')"
                >
                <p v-if="formErrors.firstName" class="mt-1 text-sm text-red-600">{{ formErrors.firstName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Doe"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                    formErrors.lastName ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                  ]"
                  @input="clearError('lastName')"
                >
                <p v-if="formErrors.lastName" class="mt-1 text-sm text-red-600">{{ formErrors.lastName }}</p>
              </div>
            </div>
          </div>

          <!-- Step 2: Account Information -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900">Account Information</h4>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Username <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="johndoe"
                    :class="[
                      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                      formErrors.username ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                    ]"
                    @input="clearError('username')"
                  >
                  <p v-if="formErrors.username" class="mt-1 text-sm text-red-600">{{ formErrors.username }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="john@example.com"
                    :class="[
                      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                      formErrors.email ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                    ]"
                    @input="clearError('email')"
                  >
                  <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :class="[
                        'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10',
                        formErrors.password ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                      ]"
                      @input="clearError('password')"
                    >
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">{{ formErrors.password }}</p>
                  <div class="mt-2">
                    <div class="text-xs text-gray-500 mb-2">Password requirements:</div>
                    <div class="space-y-1">
                      <div class="flex items-center">
                        <div :class="[
                          'w-2 h-2 rounded-full mr-2',
                          form.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                        ]"></div>
                        <span class="text-xs" :class="form.password.length >= 8 ? 'text-green-600' : 'text-gray-500'">
                          At least 8 characters
                        </span>
                      </div>
                      <div class="flex items-center">
                        <div :class="[
                          'w-2 h-2 rounded-full mr-2',
                          /[A-Z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'
                        ]"></div>
                        <span class="text-xs" :class="/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-500'">
                          At least one uppercase letter
                        </span>
                      </div>
                      <div class="flex items-center">
                        <div :class="[
                          'w-2 h-2 rounded-full mr-2',
                          /[0-9]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'
                        ]"></div>
                        <span class="text-xs" :class="/[0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-500'">
                          At least one number
                        </span>
                      </div>
                      <div class="flex items-center">
                        <div :class="[
                          'w-2 h-2 rounded-full mr-2',
                          /[@$!%*?&]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'
                        ]"></div>
                        <span class="text-xs" :class="/[@$!%*?&]/.test(form.password) ? 'text-green-600' : 'text-gray-500'">
                          At least one special character (@$!%*?&)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.phoneNumber"
                    type="tel"
                    placeholder="+855 12 345 678"
                    :class="[
                      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
                      formErrors.phoneNumber ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-blue-500'
                    ]"
                    @input="clearError('phoneNumber')"
                  >
                  <p v-if="formErrors.phoneNumber" class="mt-1 text-sm text-red-600">{{ formErrors.phoneNumber }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div class="flex space-x-6">
                  <label class="flex items-center cursor-pointer">
                    <div class="relative">
                      <input
                        type="radio"
                        v-model="form.isActive"
                        :value="true"
                        class="sr-only"
                      >
                      <div class="w-5 h-5 border rounded-full flex items-center justify-center">
                        <div v-if="form.isActive" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <span class="ml-3 text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <div class="relative">
                      <input
                        type="radio"
                        v-model="form.isActive"
                        :value="false"
                        class="sr-only"
                      >
                      <div class="w-5 h-5 border rounded-full flex items-center justify-center">
                        <div v-if="!form.isActive" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <span class="ml-3 text-sm font-medium text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Role Selection -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900">Assign Roles</h4>
            </div>

            <!-- Loading roles -->
            <div v-if="loadingRoles" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p class="mt-3 text-gray-600">Loading available roles...</p>
            </div>

            <!-- Role Selection Cards -->
            <div v-else class="space-y-4">
              <div class="text-sm text-gray-500 mb-4">
                Select one or more roles to assign permissions to this user. System roles cannot be modified.
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="role in allRoles"
                  :key="role.id"
                  @click="toggleRole(role.id)"
                  :class="[
                    'border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-blue-300',
                    selectedRoleIds.includes(role.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:shadow-md'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <div :class="[
                          'w-3 h-3 rounded-full',
                          selectedRoleIds.includes(role.id) ? 'bg-blue-500' : 'bg-gray-300'
                        ]"></div>
                        <h5 class="font-semibold text-gray-900">
                          {{ formatRoleName(role.name) }}
                        </h5>
                        <span v-if="role.isSystemRole" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          System
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-3">{{ role.description }}</p>
                      
                      <!-- Permissions Preview -->
                      <div v-if="role.permissions && role.permissions.length > 0">
                        <div class="flex items-center text-xs text-gray-500 mb-2">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {{ role.permissions.length }} permissions
                        </div>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="permission in getTopPermissions(role.permissions, 3)"
                            :key="permission.id"
                            class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {{ formatPermissionName(permission.name) }}
                          </span>
                          <span v-if="role.permissions.length > 3" class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{{ role.permissions.length - 3 }} more
                          </span>
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-400">
                        No permissions assigned
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Roles Summary -->
              <div v-if="selectedRoleIds.length > 0" class="mt-6 p-5 bg-gray-50 rounded-xl">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="font-medium text-gray-900">Selected Roles Summary</span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {{ selectedRoleIds.length }} role{{ selectedRoleIds.length > 1 ? 's' : '' }} selected
                  </span>
                </div>
                <div class="space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      v-for="roleId in selectedRoleIds"
                      :key="roleId"
                      class="p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-gray-900">
                          {{ getRoleName(roleId) }}
                        </span>
                        <button
                          @click.stop="toggleRole(roleId)"
                          class="text-red-500 hover:text-red-700"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center px-8 py-6 border-t border-gray-100">
        <button
          @click="prevStep"
          v-if="currentStep > 1"
          class="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium flex items-center"
          :disabled="loading"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div v-else></div>

        <div class="flex space-x-3">
          <button
            @click="closeModal"
            :disabled="loading"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="!isStepValid"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition',
              isStepValid
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            Continue
            <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            v-else
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition flex items-center',
              (!loading && isFormValid)
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useUserService } from '~/composables/useUserService'
import { useRoleService } from '~/composables/useRoleService'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'submit'])

// Services
const userService = useUserService()
const roleService = useRoleService()

// Form state
const form = reactive({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  roleIds: [],
  isActive: true
})

// UI state
const currentStep = ref(1)
const loading = ref(false)
const loadingRoles = ref(false)
const showPassword = ref(false)
const error = ref('')
const formErrors = reactive({})

// Role management
const allRoles = ref([])
const selectedRoleIds = ref([])

// Validation
const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.firstName.trim() && form.lastName.trim()
    case 2:
      return (
        form.username.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.phoneNumber.trim() &&
        validateEmail(form.email) &&
        validatePassword(form.password)
      )
    case 3:
      return selectedRoleIds.value.length > 0
    default:
      return false
  }
})

const isFormValid = computed(() => {
  return (
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.phoneNumber.trim() &&
    selectedRoleIds.value.length > 0 &&
    validateEmail(form.email) &&
    validatePassword(form.password)
  )
})

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

// Fetch roles from API
async function fetchAllRoles() {
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
      // Default to ROLE_USER (ID: 4 based on your API response) if it exists
      const userRole = rolesData.find(role => role.name === 'ROLE_USER')
      if (userRole) {
        selectedRoleIds.value = [userRole.id]
      }
    } else {
      allRoles.value = []
    }
  } catch (err) {
    console.error('Error fetching roles:', err)
    allRoles.value = []
    error.value = 'Failed to load roles. Please try again.'
  } finally {
    loadingRoles.value = false
  }
}

// Format role name for display
function formatRoleName(roleName) {
  if (!roleName) return ''
  return roleName.replace('ROLE_', '').replace(/_/g, ' ')
}

// Format permission name for display
function formatPermissionName(permissionName) {
  if (!permissionName) return ''
  const parts = permissionName.split('_')
  if (parts.length < 2) return permissionName
  return parts[1] + ' ' + parts[0].toLowerCase()
}

// Get top N permissions for preview
function getTopPermissions(permissions, count) {
  if (!permissions || !Array.isArray(permissions)) return []
  return permissions.slice(0, count)
}

// Get role name by ID
function getRoleName(roleId) {
  const role = allRoles.value.find(r => r.id === roleId)
  return role ? formatRoleName(role.name) : 'Unknown Role'
}

// Toggle role selection
function toggleRole(roleId) {
  const index = selectedRoleIds.value.indexOf(roleId)
  if (index > -1) {
    selectedRoleIds.value.splice(index, 1)
  } else {
    selectedRoleIds.value.push(roleId)
  }
}

// Clear error for specific field
function clearError(field) {
  if (formErrors[field]) {
    formErrors[field] = ''
  }
}

// Navigation
function nextStep() {
  if (isStepValid.value) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// API call to create user
async function createUser() {
  loading.value = true
  error.value = ''
  
  // Clear previous errors
  Object.keys(formErrors).forEach(key => formErrors[key] = '')

  try {
    // Prepare user data
    const userData = {
      ...form,
      roleIds: selectedRoleIds.value
    }

    const response = await userService.createUser(userData)
    
    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to create user')
    }

    // Success - emit submit event
    emit('submit', response?.data || userData)
    
    // Reset and close
    resetForm()
    emit('close')
    
  } catch (err) {
    console.error('Error creating user:', err)
    error.value = err.message || 'Failed to create user. Please try again.'
    
    // Handle validation errors if API returns them
    if (err.message.includes('validation') || err.message.includes('Validation')) {
      // You can parse validation errors here if your API returns them in a structured way
    }
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
  form.isActive = true
  currentStep.value = 1
  showPassword.value = false
  error.value = ''
  Object.keys(formErrors).forEach(key => formErrors[key] = '')
  
  // Reset to default role selection
  const userRole = allRoles.value.find(role => role.name === 'ROLE_USER')
  selectedRoleIds.value = userRole ? [userRole.id] : []
}

function closeModal() {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}

// Watch for modal open to fetch roles
watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchAllRoles()
  } else {
    resetForm()
  }
})

// Initialize
onMounted(() => {
  // You could pre-fetch roles here if needed
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>