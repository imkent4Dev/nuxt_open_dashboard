<template>
  <div class="mt-4 ">
    <!-- Page Title -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gradient">Dashboard</h2>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
      <!-- Left Column - Request Stats (Takes 1/4 width) -->
      <div class="xl:col-span-1">
        <h3 class="font-semibold text-gray-700 mb-4 text-gradient text-gradient">My Request</h3>
        <div class="space-y-4 rounded-xl bg-white p-4">
          <!-- Authorized Card -->
          <DashboardCard title="Authorized" :value="dashboardData.authorized" color="blue" />

          <!-- Pending Authorization Card -->
          <DashboardCard title="Pending Authorization" :value="dashboardData.pendingAuth" color="orange"
            :show-link="true" status="pending" />

          <!-- Feedback Card -->
          <DashboardCard title="Feedback" :value="dashboardData.feedback" color="red" :show-link="true"
            status="feedback" />

          <!-- Draft Card -->
          <DashboardCard title="Draft" :value="dashboardData.draft" color="gray" :show-link="true" />
        </div>
      </div>

      <!-- Right Section - Property Stats + Chart (Takes 3/4 width) -->
      <div class="xl:col-span-3 rounded-2xl ">
        <!-- Property section: Total on the left (full vertical) + 2x2 grid on the right -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-700 mb-4">Property Title</h3>

          <!-- Use flex on lg to allow left & right to stretch to same height -->
          <div class="flex flex-col lg:flex-row lg:items-stretch gap-6">
            <!-- Left: Total Property (full vertical on large screens) -->
            <div class="lg:w-1/3">
              <DashboardCard title="Total Property" :value="dashboardData.totalProperty" color="blue" class="h-full" />
            </div>

            <!-- Right: 2x2 grid -->
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DashboardCard title="HT Old Version" :value="dashboardData.htOldVersion" color="blue"
                class="min-h-[96px] sm:min-h-[112px] lg:min-h-[120px]" />

              <DashboardCard title="HT New Version" :value="dashboardData.htNewVersion" color="blue"
                class="min-h-[96px] sm:min-h-[112px] lg:min-h-[120px]" />

              <DashboardCard title="Soft Title" :value="dashboardData.softTitle" color="blue"
                class="min-h-[96px] sm:min-h-[112px] lg:min-h-[120px]" />

              <DashboardCard title="L-Map Record" :value="dashboardData.lMapRecord" color="blue"
                class="min-h-[96px] sm:min-h-[112px] lg:min-h-[120px]" />
            </div>
          </div>
        </div>



        <!-- Chart Section (Full width of right section) -->
        <div class="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-gray-700">Total with Chart Report</h3>
            <div class="flex space-x-4">
              <select v-model="chartType"
                class="px-3 py-2 bg-white bg-opacity-50 rounded-lg text-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
              <select v-model="timeFilter"
                class="px-3 py-2 bg-white bg-opacity-50 rounded-lg text-sm border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <DashboardChart :chart-data="chartData" :chart-type="chartType" />
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <!-- This section is now moved inside the right column above -->
  </div>
</template>

<script setup>
import DashboardCard from '~/components/UI/DashboardCard.vue'
import DashboardChart from '~/components/UI/DashboardChart.vue'

// Define page meta
definePageMeta({
  layout: 'default'
})

// Reactive dashboard data
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
  labels: ['HT New Version', 'Soft Title', 'HT Old Version', 'L-Map Record'],
  datasets: [{
    data: [1773.86, 890.50, 522.50, 107.80],
    backgroundColor: [
      '#60A5FA', // Blue
      '#FB923C', // Orange  
      '#F87171', // Red
      '#14B8A6'  // Teal
    ],
    borderWidth: 0
  }]
}))

// Fetch dashboard data on mount
onMounted(async () => {
  try {
    // You can replace this with actual API calls
    await fetchDashboardData()
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
})

// Mock API call - replace with real implementation
const fetchDashboardData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update data if needed
  // dashboardData.authorized = response.authorized
  // etc.
}
</script>