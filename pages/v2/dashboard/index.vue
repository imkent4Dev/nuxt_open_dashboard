<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          Welcome back, {{ authStore.getUserName }}! Here's what's happening today.
        </p>
      </div>
      
      <button class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        New Item
      </button>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardDashboardCard
        title="Total Revenue"
        :value="`$${(45231).toLocaleString()}`"
        description="vs last month"
        :icon="CurrencyDollarIcon"
        icon-color="tertiary"
        trend="+12.5%"
        trend-direction="up"
        :progress="75"
      />
      
      <DashboardDashboardCard
        title="Active Users"
        :value="(2847).toLocaleString()"
        description="Currently online"
        :icon="UsersIcon"
        icon-color="primary"
        trend="+5.2%"
        trend-direction="up"
        :progress="60"
      />
      
      <DashboardDashboardCard
        title="Orders"
        :value="(1429).toLocaleString()"
        description="This month"
        :icon="ShoppingBagIcon"
        icon-color="secondary"
        trend="-2.1%"
        trend-direction="down"
        :progress="45"
      />
      
      <DashboardDashboardCard
        title="Conversion Rate"
        value="3.2%"
        description="vs industry avg"
        :icon="ChartBarIcon"
        icon-color="purple"
        trend="+0.8%"
        trend-direction="up"
        :progress="85"
      />
    </div>

    <!-- Content grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart placeholder -->
      <div class="lg:col-span-2 card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          <select class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        
        <!-- Chart placeholder -->
        <div class="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <ChartBarIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chart would go here</p>
            <p class="text-xs">Connect your analytics service</p>
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="activity.color"
            >
              <component :is="activity.icon" class="w-4 h-4 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
        
        <button class="w-full mt-6 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          View all activity
        </button>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.name"
          class="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
        >
          <component :is="action.icon" class="w-8 h-8 text-gray-400 mb-2" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ action.name }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  CogIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

// Recent activity data
const recentActivity = [
  {
    id: 1,
    title: 'New user registered',
    time: '2 minutes ago',
    icon: UserPlusIcon,
    color: 'bg-green-500'
  },
  {
    id: 2,
    title: 'Order #1234 completed',
    time: '15 minutes ago',
    icon: CheckCircleIcon,
    color: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'System maintenance scheduled',
    time: '1 hour ago',
    icon: ExclamationTriangleIcon,
    color: 'bg-yellow-500'
  },
  {
    id: 4,
    title: 'New message received',
    time: '2 hours ago',
    icon: InformationCircleIcon,
    color: 'bg-purple-500'
  }
]

// Quick actions
const quickActions = [
  { name: 'Add User', icon: UserPlusIcon },
  { name: 'New Document', icon: DocumentPlusIcon },
  { name: 'Settings', icon: CogIcon },
  { name: 'Notifications', icon: BellIcon }
]
</script>