<template>
  <div class="p-6">
    <div class="mt-4">
      <!-- Page Title -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-red-500">Property</h2>
      </div>

      <!-- Container -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <!-- First row: Search + New Button -->
        <div class="flex items-center justify-between mb-4">
          <div></div>
          <div class="flex items-center">
            <!-- Search -->
            <div class="max-w-xs">
              <input
                v-model="search"
                type="text"
                placeholder="Search property..."
                class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>

            <!-- New Button -->
            <button
              @click="addNewProperty"
              class="ml-4 px-4 py-2 btn-gradient text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-b border-gray-300 my-4"></div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  @click="sortBy(column.key)"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div class="flex items-center">
                    {{ column.label }}
                    <svg v-if="sortKey === column.key && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                    <svg v-if="sortKey === column.key && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(property, index) in filteredProperties"
                :key="property.id"
                :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
              >
                <td class="px-6 py-4 whitespace-nowrap">{{ property.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.branchName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.submitDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.customer }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.loanType }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ property.propertyCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full':
                        true,
                      'bg-yellow-100 text-yellow-800': property.status === 'Pending Auth',
                      'bg-gray-100 text-gray-800': property.status === 'Draft',
                      'bg-blue-100 text-blue-800': property.status === 'Feedback',
                      'bg-green-100 text-green-800': property.status === 'Authorized'
                    }"
                  >
                    {{ property.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <!-- View Icon -->
                  <button @click="viewProperty(property)" class="text-blue-500 hover:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <!-- Update Icon -->
                  <button @click="updateProperty(property)" class="text-yellow-500 hover:text-yellow-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5h2m-1-1v2m1 4h.01M12 11v6m-1 4h2a2 2 0 002-2v-1H9v1a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <!-- Delete Icon -->
                  <button @click="deleteProperty(property.id)" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Branch Name', key: 'branchName' },
  { label: 'Submit Date', key: 'submitDate' },
  { label: 'Customer', key: 'customer' },
  { label: 'Type of Loan', key: 'loanType' },
  { label: 'Property Code', key: 'propertyCode' },
  { label: 'Status', key: 'status' },
]

const properties = ref([
  { id: 1, branchName: 'Central', submitDate: '2025-09-26', customer: 'John Doe', loanType: 'Home Loan', propertyCode: 'C0001000001', status: 'Pending Auth' },
  { id: 2, branchName: 'East', submitDate: '2025-09-25', customer: 'Jane Smith', loanType: 'Car Loan', propertyCode: 'C0001000002', status: 'Draft' },
  { id: 3, branchName: 'West', submitDate: '2025-09-24', customer: 'Bob Lee', loanType: 'Business Loan', propertyCode: 'C0001000003', status: 'Feedback' },
  { id: 4, branchName: 'North', submitDate: '2025-09-23', customer: 'Alice Tan', loanType: 'Home Loan', propertyCode: 'C0001000004', status: 'Authorized' },
])

const filteredProperties = computed(() => {
  let data = properties.value.filter(p =>
    Object.values(p).some(v => v.toString().toLowerCase().includes(search.value.toLowerCase()))
  )
  if (sortKey.value) {
    data.sort((a, b) => {
      if (a[sortKey.value] < b[sortKey.value]) return sortOrder.value === 'asc' ? -1 : 1
      if (a[sortKey.value] > b[sortKey.value]) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  return data
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function addNewProperty() {
  alert('Add New Property')
}

function viewProperty(property) {
  alert('View ' + property.id)
}

function updateProperty(property) {
  alert('Update ' + property.id)
}

function deleteProperty(id) {
  if (confirm('Delete property ' + id + '?')) {
    properties.value = properties.value.filter(p => p.id !== id)
  }
}
</script>

<style>
.btn-gradient {
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
}
</style>
