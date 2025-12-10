<template>
  <div class="py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p class="text-sm text-gray-500">Recent authentication and permission activities.</p>
      </div>
      <div class="flex items-center space-x-2">
        <select v-model="pageSize" @change="handlePageSize" class="border rounded-lg px-3 py-2 text-sm">
          <option v-for="size in [10, 20, 50]" :key="size" :value="size">{{ size }} / page</option>
        </select>
        <button
          @click="refresh"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200" v-if="!loading && logs.length">
            <tr v-for="log in logs" :key="log.id">
              <td class="px-4 py-3 text-sm text-gray-900">{{ log.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div class="font-medium text-gray-900">{{ log.username || '—' }}</div>
                <div class="text-xs text-gray-500">ID: {{ log.userId }}</div>
              </td>
              <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ log.action }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div>{{ log.resource }}</div>
                <div class="text-xs text-gray-500">ID: {{ log.resourceId }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ log.details }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ log.ipAddress }}</td>
              <td class="px-4 py-3">
                <span
                  :class="log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ log.success ? 'Success' : 'Failed' }}
                </span>
                <div v-if="log.errorMessage" class="text-xs text-red-500 mt-1 truncate">
                  {{ log.errorMessage }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div>{{ formatDate(log.timestamp) }}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="loading">
            <tr>
              <td colspan="8" class="px-4 py-6 text-center text-gray-500 text-sm">Loading logs...</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8" class="px-4 py-6 text-center text-gray-500 text-sm">No audit logs found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
        <div>
          Page {{ page + 1 }} of {{ totalPages || 1 }} · {{ totalElements }} records
        </div>
        <div class="space-x-2">
          <button
            @click="prevPage"
            :disabled="page === 0 || loading"
            class="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <button
            @click="nextPage"
            :disabled="page >= totalPages - 1 || loading"
            class="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const { get } = useHttp()

const logs = ref([])
const loading = ref(false)
const error = ref('')
const page = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

const ENDPOINT = '/api/v1/audit-logs'

const fetchLogs = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await get(`${ENDPOINT}?page=${page.value}&size=${pageSize.value}`)
    const payload = response?.data || response
    const data = payload?.data || payload
    const pagination = payload?.pagination || {}

    logs.value = data?.content || []
    totalPages.value = data?.totalPages ?? pagination?.totalPages ?? 0
    totalElements.value = data?.totalElements ?? pagination?.totalElements ?? 0
  } catch (err) {
    console.error('Failed to load audit logs', err)
    error.value = err.message || 'Failed to load audit logs'
    logs.value = []
    totalPages.value = 0
    totalElements.value = 0
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  fetchLogs()
}

const nextPage = () => {
  if (page.value < totalPages.value - 1) {
    page.value += 1
    fetchLogs()
  }
}

const prevPage = () => {
  if (page.value > 0) {
    page.value -= 1
    fetchLogs()
  }
}

const handlePageSize = () => {
  page.value = 0
  fetchLogs()
}

const formatDate = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString()
}

onMounted(() => {
  fetchLogs()
})
</script>

