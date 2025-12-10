<template>
  <div class="py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-600">Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
      <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to load dashboard</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="fetchDashboardData"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
      >
        Try Again
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Page Header with User Role Info -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div class="flex items-center mt-2 space-x-4">
              <div class="flex items-center">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="roleBadgeClass">
                  {{ userRole.name }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                Welcome back, {{ userData.name }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="fetchDashboardData"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Refresh
            </button>
            <button v-if="hasPermission('USER_CREATE')"
              @click="navigateTo('/users/new')"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              + New User
            </button>
          </div>
        </div>
        
        <!-- Permissions Summary -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Your Permissions</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ userRole.permissions?.length || 0 }} permissions granted
              </p>
            </div>
            <NuxtLink v-if="hasPermission('ROLE_READ')" to="/roles"
              class="text-sm text-blue-600 hover:text-blue-800">
              View Roles →
            </NuxtLink>
          </div>
          
          <!-- Quick Permission Tags -->
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="permission in quickPermissions" :key="permission"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {{ formatPermissionName(permission) }}
            </span>
            <span v-if="userRole.permissions?.length > 3" class="text-xs text-gray-500">
              +{{ userRole.permissions.length - 3 }} more
            </span>
          </div>
        </div>
      </div>

      <!-- Role-Based Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Left Column: User Stats & Permissions -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Role Summary Card -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Role Information</h3>
                <div class="mt-3">
                  <p class="text-2xl font-bold text-gray-900">{{ formatRoleName(userRole.name) }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ userRole.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-medium text-gray-500">Level</div>
                <div class="text-2xl font-bold text-blue-600">{{ userRole.level }}</div>
              </div>
            </div>
            
            <!-- Permission Progress -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Permission Score</span>
                <span class="text-sm font-bold text-gray-900">{{ permissionScore }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${permissionScore}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Quick Actions (Based on Permissions) -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button v-if="hasPermission('USER_CREATE')"
                @click="navigateTo('/users/new')"
                class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
              
              <button v-if="hasPermission('ROLE_CREATE')"
                @click="navigateTo('/roles/new')"
                class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Create Role
              </button>
              
              <NuxtLink v-if="hasPermission('PERMISSION_READ')" to="/permissions"
                class="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                View Permissions
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right Column: Main Dashboard Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Role-Based Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Total Users -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Total Users</h3>
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9A5.5 5.5 0 0012 3.5 5.5 5.5 0 006.5 9c0 1.43.56 2.74 1.47 3.7" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.totalUsers) }}</div>
              <p class="text-sm text-gray-500 mt-2">Registered users in system</p>
              <NuxtLink v-if="hasPermission('USER_READ')" to="/users"
                class="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800">
                View Users →
              </NuxtLink>
            </div>

            <!-- Active Users -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Active Users</h3>
                <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.activeUsers) }}</div>
              <p class="text-sm text-gray-500 mt-2">Currently active users</p>
              <div class="mt-4">
                <div class="text-xs text-gray-500 mb-1">Inactive: {{ dashboardData.inactiveUsers }}</div>
                <div class="w-full bg-gray-200 rounded-full h-1">
                  <div class="bg-green-500 h-1 rounded-full" :style="{ width: `${activeUserPercentage}%` }"></div>
                </div>
              </div>
            </div>

            <!-- Total Roles -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Total Roles</h3>
                <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.totalRoles) }}</div>
              <p class="text-sm text-gray-500 mt-2">System & custom roles</p>
              <NuxtLink v-if="hasPermission('ROLE_READ')" to="/roles"
                class="inline-block mt-4 text-sm text-purple-600 hover:text-purple-800">
                Manage Roles →
              </NuxtLink>
            </div>

            <!-- Total Permissions -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Permissions</h3>
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.totalPermissions) }}</div>
              <p class="text-sm text-gray-500 mt-2">Available permissions</p>
              <NuxtLink v-if="hasPermission('PERMISSION_READ')" to="/permissions"
                class="inline-block mt-4 text-sm text-orange-600 hover:text-orange-800">
                View All →
              </NuxtLink>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">Recent Logins</h3>
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.loginsLast24Hours) }}</div>
              <p class="text-sm text-gray-500 mt-2">Logins in last 24 hours</p>
              <button v-if="hasPermission('AUDIT_READ')" @click="navigateTo('/audit-logs')"
                class="inline-block mt-4 text-sm text-gray-600 hover:text-gray-800">
                View Logs →
              </button>
            </div>

            <!-- System Health -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">System Health</h3>
                <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ systemHealth }}%</div>
              <p class="text-sm text-gray-500 mt-2">System status</p>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" :style="{ width: `${systemHealth}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Logs Table -->
          <div v-if="hasPermission('AUDIT_READ') && dashboardData.recentAuditLogs?.length > 0" class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Recent Activity Logs</h3>
                <p class="text-sm text-gray-500 mt-1">Latest user activities and system events</p>
              </div>
              <NuxtLink to="/audit-logs" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Logs →
              </NuxtLink>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="log in dashboardData.recentAuditLogs.slice(0, 5)" :key="log.id">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {{ getInitials(log.username || 'Unknown') }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ log.username || 'System' }}</div>
                          <div class="text-xs text-gray-500">ID: {{ log.userId || 'N/A' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getActionColor(log.action)
                      ]">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {{ log.resource }}
                      <div v-if="log.resourceId" class="text-xs text-gray-500">ID: {{ log.resourceId }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {{ log.details }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {{ formatTimeAgo(log.timestamp) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ log.success ? 'Success' : 'Failed' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- User Role Distribution -->
          <div v-if="hasPermission('USER_READ') && roleDistribution.length > 0" class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">User Role Distribution</h3>
                <p class="text-sm text-gray-500 mt-1">Breakdown of users by their roles</p>
              </div>
              <button @click="fetchDashboardData"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Refresh
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="role in roleDistribution" 
                :key="role.id"
                class="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatRoleName(role.name) }}
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full" :class="role.isSystemRole ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                    {{ role.isSystemRole ? 'System' : 'Custom' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900">{{ role.userCount || 0 }}</div>
                <div class="mt-2">
                  <div class="text-xs text-gray-500 mb-1">Percentage</div>
                  <div class="w-full bg-gray-200 rounded-full h-1">
                    <div class="bg-blue-500 h-1 rounded-full" :style="{ width: `${rolePercentage(role)}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define page meta
definePageMeta({
  layout: 'default'
})

import { useAuthStore } from '~/stores/auth'
import { useHttp } from '~/services/httpClient'
import { useRoute } from 'nuxt/app'

const router = useRoute()
const authStore = useAuthStore()
const http = useHttp()

const loading = ref(false)
const error = ref('')

// User data from auth store
const userData = computed(() => ({
  name: authStore.user?.firstName ? `${authStore.user.firstName} ${authStore.user.lastName}` : authStore.user?.username || 'User',
  role: authStore.user?.role?.name || 'ROLE_USER',
  permissions: authStore.user?.role?.permissions || [],
  lastLogin: authStore.user?.lastLogin || null
}))

// Role definitions based on actual API roles
const roles = {
  'ROLE_SUPER_ADMIN': {
    name: 'ROLE_SUPER_ADMIN',
    level: 4,
    description: 'Super Administrator - Full system access with all permissions',
    color: 'bg-red-100 text-red-800'
  },
  'ROLE_ADMIN': {
    name: 'ROLE_ADMIN',
    level: 3,
    description: 'Administrator - User, Role, and Permission management',
    color: 'bg-blue-100 text-blue-800'
  },
  'ROLE_MANAGER': {
    name: 'ROLE_MANAGER',
    level: 2,
    description: 'Manager - Content and Report management with user read access',
    color: 'bg-green-100 text-green-800'
  },
  'ROLE_USER': {
    name: 'ROLE_USER',
    level: 1,
    description: 'Regular User - Basic read access only',
    color: 'bg-gray-100 text-gray-800'
  }
}

// Get user role
const userRole = computed(() => {
  const roleName = userData.value.role
  return roles[roleName] || {
    name: roleName,
    level: 1,
    description: 'User role',
    color: 'bg-gray-100 text-gray-800',
    permissions: userData.value.permissions || []
  }
})

// Permission check function
const hasPermission = (permission) => {
  return Array.isArray(userRole.value.permissions) && userRole.value.permissions.includes(permission)
}

// Quick permissions for display
const quickPermissions = computed(() => {
  const perms = userRole.value.permissions || []
  return perms.slice(0, 3)
})

// Permission score
const permissionScore = computed(() => {
  const totalPossible = 24 // Total permissions from your API
  const userPerms = userRole.value.permissions?.length || 0
  return Math.round((userPerms / totalPossible) * 100)
})

// Role badge class
const roleBadgeClass = computed(() => userRole.value.color)

// Dashboard data
const dashboardData = ref({
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  totalRoles: 0,
  totalPermissions: 0,
  loginsLast24Hours: 0,
  recentAuditLogs: []
})

// Computed properties
const activeUserPercentage = computed(() => {
  if (dashboardData.value.totalUsers === 0) return 0
  return Math.round((dashboardData.value.activeUsers / dashboardData.value.totalUsers) * 100)
})

const systemHealth = computed(() => {
  // Calculate system health based on recent successful activities
  const recentLogs = dashboardData.value.recentAuditLogs || []
  if (recentLogs.length === 0) return 100
  
  const successfulLogs = recentLogs.filter(log => log.success).length
  return Math.round((successfulLogs / recentLogs.length) * 100)
})

const roleDistribution = computed(() => {
  // This would need to come from your API
  // For now, using static data that matches your API response
  return [
    { id: 1, name: 'ROLE_SUPER_ADMIN', userCount: 1, isSystemRole: true },
    { id: 2, name: 'ROLE_ADMIN', userCount: 1, isSystemRole: true },
    { id: 3, name: 'ROLE_MANAGER', userCount: 0, isSystemRole: true },
    { id: 4, name: 'ROLE_USER', userCount: 1, isSystemRole: true }
  ]
})

// Formatting functions
const formatNumber = (num) => {
  return num?.toLocaleString() || '0'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return formatDate(dateString)
}

const formatRoleName = (roleName) => {
  if (!roleName) return ''
  return roleName.replace('ROLE_', '').replace(/_/g, ' ')
}

const formatPermissionName = (permissionName) => {
  if (!permissionName) return ''
  const parts = permissionName.split('_')
  if (parts.length < 2) return permissionName
  return `${parts[1]} ${parts[0].toLowerCase()}`
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

const getActionColor = (action) => {
  const colors = {
    LOGIN: 'bg-blue-100 text-blue-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    CREATE: 'bg-green-100 text-green-800',
    READ: 'bg-blue-100 text-blue-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800'
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

const rolePercentage = (role) => {
  if (dashboardData.value.totalUsers === 0) return 0
  return Math.round(((role.userCount || 0) / dashboardData.value.totalUsers) * 100)
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await http.get('/api/v1/dashboard')
    
    if (response && response.success === false) {
      throw new Error(response.message?.en || 'Failed to fetch dashboard data')
    }
    
    const data = response?.data || response
    
    // Update dashboard data
    dashboardData.value = {
      totalUsers: data.totalUsers || 0,
      activeUsers: data.activeUsers || 0,
      inactiveUsers: data.inactiveUsers || 0,
      totalRoles: data.totalRoles || 0,
      totalPermissions: data.totalPermissions || 0,
      loginsLast24Hours: data.loginsLast24Hours || 0,
      recentAuditLogs: data.recentAuditLogs || []
    }
    
  } catch (err) {
    console.error('Error fetching dashboard:', err)
    error.value = err.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

// Navigation
const navigateTo = (path) => {
  router.push(path)
}

// Fetch initial data on component mount
onMounted(() => {
  fetchDashboardData()
})
</script>