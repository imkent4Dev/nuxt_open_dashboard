<template>
  <div class="py-6">
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
              Last login: {{ formatDate(userData.lastLogin) }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="refreshDashboard"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Refresh
          </button>
          <button v-if="hasPermission('export_data')"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Export
          </button>
        </div>
      </div>
      
      <!-- Permissions Summary -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Available Permissions</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ userRole.permissions.length }} of {{ totalPermissions }} permissions granted
            </p>
          </div>
          <NuxtLink v-if="hasPermission('manage_roles')" to="/settings/permissions"
            class="text-sm text-blue-600 hover:text-blue-800">
            Manage Permissions →
          </NuxtLink>
        </div>
        
        <!-- Quick Permission Tags -->
        <div class="flex flex-wrap gap-2 mt-3">
          <span v-for="permission in quickPermissions" :key="permission"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{ permission }}
          </span>
          <span v-if="userRole.permissions.length > 3" class="text-xs text-gray-500">
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
                <p class="text-2xl font-bold text-gray-900">{{ userRole.name }}</p>
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
            <button v-if="hasPermission('create_request')"
              @click="showCreateModal = true"
              class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Request
            </button>
            
            <NuxtLink v-if="hasPermission('view_analytics')" to="/analytics"
              class="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              View Analytics
            </NuxtLink>
            
            <NuxtLink v-if="hasPermission('manage_users')" to="/users"
              class="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              User Management
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right Column: Main Dashboard Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Role-Based Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Authorized Requests -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Authorized</h3>
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.authorized) }}</div>
            <p class="text-sm text-gray-500 mt-2">Total approved requests</p>
            <NuxtLink v-if="hasPermission('view_authorized')" to="/requests/authorized"
              class="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800">
              View Details →
            </NuxtLink>
          </div>

          <!-- Pending Authorization -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Pending Authorization</h3>
              <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.pendingAuth) }}</div>
            <p class="text-sm text-gray-500 mt-2">Awaiting your approval</p>
            <button v-if="hasPermission('approve_requests')" @click="showPendingRequests"
              class="inline-block mt-4 text-sm text-orange-600 hover:text-orange-800">
              Review Now →
            </button>
          </div>

          <!-- Requires Feedback -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Requires Feedback</h3>
              <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.feedback) }}</div>
            <p class="text-sm text-gray-500 mt-2">Need your input</p>
            <button v-if="hasPermission('provide_feedback')" @click="showFeedbackModal = true"
              class="inline-block mt-4 text-sm text-red-600 hover:text-red-800">
              Provide Feedback →
            </button>
          </div>

          <!-- Draft Requests -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Draft Requests</h3>
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.draft) }}</div>
            <p class="text-sm text-gray-500 mt-2">Saved for later</p>
            <NuxtLink v-if="hasPermission('create_request')" to="/requests/drafts"
              class="inline-block mt-4 text-sm text-gray-600 hover:text-gray-800">
              Continue Editing →
            </NuxtLink>
          </div>

          <!-- Total Properties (Admin only) -->
          <div v-if="hasPermission('view_all_properties')" class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">Total Properties</h3>
              <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.totalProperty) }}</div>
            <p class="text-sm text-gray-500 mt-2">Across all categories</p>
            <NuxtLink to="/properties"
              class="inline-block mt-4 text-sm text-purple-600 hover:text-purple-800">
              Manage Properties →
            </NuxtLink>
          </div>

          <!-- Activity Summary -->
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-900">This Month</h3>
              <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">+24%</div>
            <p class="text-sm text-gray-500 mt-2">Increase in activity</p>
            <button @click="showActivityReport"
              class="inline-block mt-4 text-sm text-green-600 hover:text-green-800">
              View Report →
            </button>
          </div>
        </div>

        <!-- Property Types Breakdown (Conditional based on permission) -->
        <div v-if="hasPermission('view_property_stats')" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Property Types Breakdown</h3>
              <p class="text-sm text-gray-500 mt-1">Distribution of property titles by type</p>
            </div>
            <select v-model="timeFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 rounded-lg border border-gray-100">
              <div class="text-sm font-medium text-gray-900 mb-2">HT New Version</div>
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(dashboardData.htNewVersion) }}</div>
              <div class="flex items-center mt-2">
                <span class="text-sm text-green-600">+12.5%</span>
                <span class="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div class="p-4 rounded-lg border border-gray-100">
              <div class="text-sm font-medium text-gray-900 mb-2">HT Old Version</div>
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(dashboardData.htOldVersion) }}</div>
              <div class="flex items-center mt-2">
                <span class="text-sm text-red-600">-3.2%</span>
                <span class="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div class="p-4 rounded-lg border border-gray-100">
              <div class="text-sm font-medium text-gray-900 mb-2">Soft Title</div>
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(dashboardData.softTitle) }}</div>
              <div class="flex items-center mt-2">
                <span class="text-sm text-green-600">+8.7%</span>
                <span class="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div class="p-4 rounded-lg border border-gray-100">
              <div class="text-sm font-medium text-gray-900 mb-2">L-Map Record</div>
              <div class="text-2xl font-bold text-gray-900">{{ formatNumber(dashboardData.lMapRecord) }}</div>
              <div class="flex items-center mt-2">
                <span class="text-sm text-green-600">+21.3%</span>
                <span class="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Performance Analytics</h3>
              <p class="text-sm text-gray-500 mt-1">Based on your role and permissions</p>
            </div>
            <div class="flex space-x-3">
              <select v-model="chartType"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          <DashboardChart :chart-data="chartData" :chart-type="chartType" />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Add your modals here -->
  </div>
</template>

<script setup>
import DashboardChart from '~/components/UI/DashboardChart.vue'

// Define page meta
definePageMeta({
  layout: 'default'
})

// User data
const userData = reactive({
  name: 'John Doe',
  lastLogin: new Date(),
  role: 'admin' // admin, manager, user, viewer
})

// Role definitions
const roles = {
  admin: {
    name: 'Administrator',
    level: 4,
    description: 'Full system access with all permissions',
    permissions: [
      'create_request',
      'view_authorized',
      'approve_requests',
      'provide_feedback',
      'view_all_properties',
      'view_property_stats',
      'manage_users',
      'manage_roles',
      'export_data',
      'view_analytics'
    ],
    color: 'bg-red-100 text-red-800'
  },
  manager: {
    name: 'Manager',
    level: 3,
    description: 'Can manage team requests and approvals',
    permissions: [
      'create_request',
      'view_authorized',
      'approve_requests',
      'provide_feedback',
      'view_property_stats',
      'view_analytics'
    ],
    color: 'bg-blue-100 text-blue-800'
  },
  user: {
    name: 'Standard User',
    level: 2,
    description: 'Can create and track own requests',
    permissions: [
      'create_request',
      'view_authorized',
      'provide_feedback'
    ],
    color: 'bg-green-100 text-green-800'
  },
  viewer: {
    name: 'Viewer',
    level: 1,
    description: 'Read-only access to dashboard',
    permissions: [
      'view_authorized',
      'view_analytics'
    ],
    color: 'bg-gray-100 text-gray-800'
  }
}

// Get user role
const userRole = computed(() => roles[userData.role] || roles.viewer)

// Permission check function
const hasPermission = (permission) => {
  return userRole.value.permissions.includes(permission)
}

// Quick permissions for display
const quickPermissions = computed(() => {
  return userRole.value.permissions.slice(0, 3)
})

// Permission score
const permissionScore = computed(() => {
  const totalPossible = Object.values(roles).reduce((max, role) => 
    Math.max(max, role.permissions.length), 0
  )
  return Math.round((userRole.value.permissions.length / totalPossible) * 100)
})

const totalPermissions = computed(() => {
  return Object.values(roles).reduce((total, role) => 
    total + role.permissions.length, 0
  )
})

// Role badge class
const roleBadgeClass = computed(() => userRole.value.color)

// Dashboard data
const dashboardData = reactive({
  authorized: 168168,
  pendingAuth: 43,
  feedback: 12,
  draft: 5,
  totalProperty: 2344,
  htNewVersion: 4321,
  lMapRecord: 34,
  htOldVersion: 168,
  softTitle: 90
})

// Chart controls
const chartType = ref('pie')
const timeFilter = ref('today')

// Chart data
const chartData = computed(() => ({
  labels: ['Authorized', 'Pending', 'Feedback', 'Draft'],
  datasets: [{
    label: 'Requests',
    data: [
      dashboardData.authorized,
      dashboardData.pendingAuth,
      dashboardData.feedback,
      dashboardData.draft
    ],
    backgroundColor: [
      '#10B981', // Green for authorized
      '#F59E0B', // Orange for pending
      '#EF4444', // Red for feedback
      '#6B7280'  // Gray for draft
    ],
    borderWidth: 0
  }]
}))

// Formatting functions
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Actions
const refreshDashboard = async () => {
  // Implement refresh logic
  console.log('Refreshing dashboard...')
}

const showPendingRequests = () => {
  // Implement show pending requests
  console.log('Showing pending requests...')
}

const showActivityReport = () => {
  // Implement show activity report
  console.log('Showing activity report...')
}
</script>