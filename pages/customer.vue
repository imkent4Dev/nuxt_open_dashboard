<template>
  <div class="p-6">
    <div class="mt-4">
      <!-- Page Title -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gradient">Users</h2>
      </div>

      <!-- Container -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-600">Loading users...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-500 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-600 font-semibold">{{ error }}</p>
          <button @click="fetchUsers" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Retry
          </button>
        </div>

        <!-- Data State -->
        <div v-else>
          <!-- First row: Search + New Button -->
          <div class="flex items-center justify-between mb-4">
            <div></div>
            <div class="flex items-center">
              <!-- Search -->
              <div class="max-w-xs">
                <input v-model="searchQuery" type="text" placeholder="Search user..."
                  class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  @input="handleSearch" />
              </div>

              <!-- New Button -->
              <button @click="showAddModal = true"
                class="ml-4 px-4 py-2 btn-gradient text-white rounded-lg shadow hover:bg-blue-600 transition">
                + Add New
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-b border-gray-300 my-4"></div>

          <!-- Second row: Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">User ID</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Username</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Roles</th>
                  <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Created At</th>
                  <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in paginatedData" :key="user.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="border-t hover:bg-gray-100">
                  <td class="px-4 py-2 text-sm">{{ user.id }}</td>
                  <td class="px-4 py-2 text-sm font-medium">{{ user.username }}</td>
                  <td class="px-4 py-2 text-sm">{{ user.firstName }} {{ user.lastName }}</td>
                  <td class="px-4 py-2 text-sm">{{ user.email }}</td>
                  <td class="px-4 py-2 text-sm">{{ user.phoneNumber }}</td>
                  <td class="px-4 py-2 text-sm">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-sm">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="role in user.roles" :key="role.id"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {{ role.name.replace('ROLE_', '') }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-2 text-sm">{{ formatDate(user.createdAt) }}</td>
                  <td class="px-4 py-2 text-right">
                    <div class="flex items-center justify-end space-x-2">
                      <!-- Eye -->
                      <button @click="viewUser(user)" class="p-1.5 hover:bg-blue-50 rounded">
                        <EyeIcon class="w-5 h-5 text-blue-500" />
                      </button>
                      <!-- Edit -->
                      <button @click="editUser(user)" class="p-1.5 hover:bg-blue-50 rounded">
                        <PencilSquareIcon class="w-5 h-5 text-blue-500" />
                      </button>
                      <!-- Delete -->
                      <button @click="deleteUser(user)" class="p-1.5 hover:bg-red-50 rounded">
                        <TrashIcon class="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="!loading && paginatedData.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
              <div class="mt-6">
                <button @click="showAddModal = true"
                  class="px-4 py-2 btn-gradient text-white rounded-lg shadow hover:bg-blue-600 transition">
                  + Add New User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && paginatedData.length > 0" class="flex justify-between items-center mt-4 space-x-4">
        <!-- Total items -->
        <div class="text-sm text-gray-600">
          Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} users
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center space-x-4">
          <!-- Page size dropdown -->
          <div>
            <select v-model="itemsPerPage" @change="handlePageSizeChange"
              class="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="30">30 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>

          <!-- Navigation -->
          <div class="flex items-center space-x-2">
            <!-- Previous -->
            <button @click="prevPage" :disabled="currentPage === 0"
              class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              ←
            </button>

            <!-- Page Numbers -->
            <div class="flex space-x-1">
              <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" :class="[
                'px-3 py-1 rounded-lg border text-sm',
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-100'
              ]">
                {{ page + 1 }}
              </button>
            </div>

            <!-- Next -->
            <button @click="nextPage" :disabled="currentPage === totalPages - 1 || totalPages === 0"
              class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              →
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddCustomerModal :show="showAddModal" @close="showAddModal = false" @submit="addUser" />
      
      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal show">
        <div class="modal-content">
          <div class="flex justify-center mb-4">
            <img src="/icons/success.png" alt="Success Tick" class="w-25 h-22" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Successful</h3>
          <p class="text-gray-600 mb-4">You have successfully created</p>
          <button @click="showSuccessModal = false" class="px-4 py-4 btn-gradient transition-colors duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import AddCustomerModal from '~/components/AddCustomerModal.vue';

// API Configuration
const API_BASE_URL = 'http://localhost:8081/api/v1';
const AUTH_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NTI3MjYwNCwiZXhwIjoxNzY1MzU5MDA0fQ.LQQfaX4Ahi6TU2B4RznF_BdTD3LuK6o9-268uMa8Pt2oa5j0JV-tyqptUGJyy56O';

// Reactive state
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(0);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);
const showAddModal = ref(false);
const showSuccessModal = ref(false);

// Fetch users from API
async function fetchUsers() {
  try {
    loading.value = true;
    error.value = null;
    
    const params = new URLSearchParams({
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: 'id',
      sortDir: 'DESC'
    });

    // Add search parameter if search query exists
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim());
    }

    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      users.value = data.data.content;
      totalItems.value = data.data.totalElements;
      totalPages.value = data.data.totalPages;
      currentPage.value = data.data.number;
    } else {
      throw new Error(data.message?.en || 'Failed to fetch users');
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = err.message || 'Failed to load users. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Handle search with debounce
let searchTimeout = null;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    fetchUsers();
  }, 500);
}

// Handle page size change
function handlePageSizeChange() {
  currentPage.value = 0;
  fetchUsers();
}

// Pagination functions
function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchUsers();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchUsers();
  }
}

function goToPage(page) {
  currentPage.value = page;
  fetchUsers();
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Computed properties
const paginatedData = computed(() => users.value);

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(0, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage >= totalPages.value) {
    endPage = totalPages.value - 1;
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i >= 0 && i < totalPages.value) {
      pages.push(i);
    }
  }

  return pages;
});

const startItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value + 1, totalItems.value);
});

const endItem = computed(() => {
  return Math.min((currentPage.value + 1) * itemsPerPage.value, totalItems.value);
});

// User actions
function viewUser(user) {
  console.log('View user:', user);
  // Implement view user logic
}

function editUser(user) {
  console.log('Edit user:', user);
  // Implement edit user logic
}

function deleteUser(user) {
  if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
    console.log('Delete user:', user);
    // Implement delete user logic
  }
}

function addUser(newUser) {
  // This would typically make an API call to create a new user
  console.log('Add new user:', newUser);
  showAddModal.value = false;
  showSuccessModal.value = true;
  // Refresh the user list after adding
  setTimeout(() => fetchUsers(), 1000);
}

// Lifecycle hooks
onMounted(() => {
  fetchUsers();
});

// Watch for pagination changes (handled via API calls)
watch([currentPage, itemsPerPage], () => {
  fetchUsers();
}, { immediate: false });
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, #4b6cb7, #182848);
  -webkit-background-clip: text;
  color: transparent;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  width: 400px;
  margin: 15% auto;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal.show {
  display: block;
}

.btn-gradient {
  background: linear-gradient(90deg, #4b6cb7, #182848);
}

.btn-gradient:hover {
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