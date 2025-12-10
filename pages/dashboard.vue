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
                Welcome back, {{ userData.name }}
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="refreshDashboard"
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
                {{ userRole.permissions.length }} permissions granted
              </p>
            </div>
            <NuxtLink v-if="hasPermission('ROLE_READ')" to="/roles"
              class="text-sm text-blue-600 hover:text-blue-800">
              View Roles →
            </NuxtLink>
          </div>
          
          <!-- Quick Permission Tags -->
          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="permission in quickPermissions" :key="permission.id"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {{ formatPermissionName(permission.name) }}
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
              <p class="text-sm text-gray-500 mt-2">Currently active</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-green-600">+{{ dashboardData.newUsersThisMonth }}</span>
                <span class="text-xs text-gray-500 ml-2">new this month</span>
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
                <h3 class="text-sm font-medium text-gray-900">Recent Activity</h3>
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.recentActivities) }}</div>
              <p class="text-sm text-gray-500 mt-2">Activities in last 24h</p>
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
              <div class="text-3xl font-bold text-gray-900">{{ dashboardData.systemHealth }}%</div>
              <p class="text-sm text-gray-500 mt-2">All systems operational</p>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" :style="{ width: `${dashboardData.systemHealth}%` }"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- User Role Distribution -->
          <div v-if="hasPermission('USER_READ')" class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">User Role Distribution</h3>
                <p class="text-sm text-gray-500 mt-1">Breakdown of users by their roles</p>
              </div>
              <button @click="refreshUserStats"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Refresh
              </button>
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="role in roleDistribution" 
                :key="role.id"
                class="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
                @click="navigateTo(`/users?role=${role.name}`)"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatRoleName(role.name) }}
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full" :class="role.isSystemRole ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                    {{ role.isSystemRole ? 'System' : 'Custom' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900">{{ role.userCount }}</div>
                <div class="flex items-center mt-2">
                  <span class="text-sm" :class="role.percentage >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ role.percentage >= 0 ? '+' : '' }}{{ role.percentage }}%
                  </span>
                  <span class="text-xs text-gray-500 ml-2">of total users</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Recent Users Table -->
          <div v-if="hasPermission('USER_READ')" class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Recent Users</h3>
                <p class="text-sm text-gray-500 mt-1">Newly registered users</p>
              </div>
              <NuxtLink to="/users" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </NuxtLink>
            </div>
  
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in recentUsers" :key="user.id">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {{ user.initials }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {{ formatRoleName(user.role) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ user.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.joined) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                      <button 
                        v-if="hasPermission('USER_READ')"
                        @click="viewUser(user.id)"
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        View
                      </button>
                      <button 
                        v-if="hasPermission('USER_UPDATE')"
                        @click="editUser(user.id)"
                        class="text-green-600 hover:text-green-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { get } = useHttp()
  
  const loading = ref(false)
  const error = ref('')
  
  const userData = computed(() => ({
    name: authStore.user?.name || 'User',
    role: authStore.user?.role?.name || 'ROLE_USER',
    permissions: authStore.user?.role?.permissions || [],
    lastLogin: authStore.user?.lastLogin || null
  }))
  
  const userRole = computed(() => ({
    name: userData.value.role,
    level: authStore.user?.role?.level || 1,
    description: authStore.user?.role?.description || '',
    permissions: userData.value.permissions,
    color: authStore.user?.role?.color || 'bg-blue-100 text-blue-800'
  }))
  
  const hasPermission = (permission) => {
    return Array.isArray(userRole.value.permissions) && userRole.value.permissions.includes(permission)
  }
  
  const quickPermissions = computed(() => (userRole.value.permissions || []).slice(0, 3).map((name, idx) => ({
    id: idx,
    name
  })))
  
  const permissionScore = computed(() => {
    const maxPermissions = Math.max(userRole.value.permissions?.length || 0, 1)
    return Math.round((userRole.value.permissions?.length || 0) / maxPermissions * 100)
  })
  
  const roleBadgeClass = computed(() => userRole.value.color)
  
  const dashboardData = reactive({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalRoles: 0,
    totalPermissions: 0,
    recentActivities: 0,
    systemHealth: 0
  })
  
  const roleDistribution = ref([])
  const recentUsers = ref([])
  
  const ENDPOINTS = {
    summary: '/api/v1/dashboard/summary',
    roleDistribution: '/api/v1/dashboard/role-distribution',
    recentUsers: '/api/v1/dashboard/recent-users'
  }
  
  const loadDashboard = async () => {
    loading.value = true
    error.value = ''
  
    try {
      const [summaryRes, rolesRes, recentRes] = await Promise.all([
        get(ENDPOINTS.summary),
        get(ENDPOINTS.roleDistribution),
        get(ENDPOINTS.recentUsers)
      ])
  
      const summary = summaryRes.data || summaryRes
      dashboardData.totalUsers = summary.totalUsers ?? 0
      dashboardData.activeUsers = summary.activeUsers ?? 0
      dashboardData.newUsersThisMonth = summary.newUsersThisMonth ?? 0
      dashboardData.totalRoles = summary.totalRoles ?? 0
      dashboardData.totalPermissions = summary.totalPermissions ?? 0
      dashboardData.recentActivities = summary.recentActivities ?? 0
      dashboardData.systemHealth = summary.systemHealth ?? 0
  
      roleDistribution.value = rolesRes.data || rolesRes || []
      recentUsers.value = recentRes.data || recentRes || []
    } catch (err) {
      console.error('Failed to load dashboard', err)
      error.value = err.message || 'Failed to load dashboard data'
    } finally {
      loading.value = false
    }
  }
  
  // Formatting functions
  const formatNumber = (num) => {
    return num.toLocaleString()
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
  
  // Navigation
  const navigateTo = (path) => {
    router.push(path)
  }
  
  const viewUser = (userId) => {
    navigateTo(`/users/${userId}`)
  }
  
  const editUser = (userId) => {
    navigateTo(`/users/${userId}/edit`)
  }
  
  // Actions
  const refreshDashboard = async () => {
    await loadDashboard()
  }
  
  const refreshUserStats = async () => {
    await loadDashboard()
  }
  
  // Fetch initial data on component mount
  onMounted(() => {
    loadDashboard()
  })
  </script>