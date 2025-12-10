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
                class="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition">
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
                <tr v-for="(user, index) in filteredUsers" :key="user.id"
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
                      <button @click="viewUser(user.id)" class="p-1.5 hover:bg-blue-50 rounded">
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
            <div v-if="!loading && filteredUsers.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
              <div class="mt-6">
                <button @click="showAddModal = true"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition">
                  + Add New User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && filteredUsers.length > 0" class="flex justify-between items-center mt-4 space-x-4">
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
    </div>
  </div>

  <!-- Modals -->
  <AddCustomerModal 
    :show="showAddModal" 
    @close="showAddModal = false" 
    @submit="addUser" 
  />
    <EditUserModal
    :show="showEditModal"
    :userId="selectedUserId"
    :isEditMode="isEditMode"
    @close="handleModalClose"
    @success="handleUserUpdateSuccess"
  />
  <!-- Success Modal -->
  <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
      <div class="flex justify-center mb-4">
        <img src="/icons/success.png" alt="Success Tick" class="w-16 h-16" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">Successful</h3>
      <p class="text-gray-600 mb-4 text-center">User has been created successfully!</p>
      <div class="flex justify-center">
        <button @click="showSuccessModal = false" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import AddCustomerModal from '~/components/AddCustomerModal.vue';
import EditUserModal from '~/components/EditUserModal.vue';
import { useUserService } from '~/composables/useUserService';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();

// Initialize services
const userService = useUserService();
const authStore = useAuthStore();

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
const showEditModal = ref(false);
const showSuccessModal = ref(false);
const selectedUserId = ref(null);
const isEditMode = ref(false);
const successMessage = ref('');

// Fetch users from API using service
async function fetchUsers() {
  try {
    loading.value = true;
    error.value = null;

    const params = {
      page: currentPage.value,
      size: itemsPerPage.value,
      sortBy: 'id',
      sortDir: 'DESC'
    };

    // Add search parameter if search query exists
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    // Use your service pattern
    const response = await userService.getUsers(params);
    
    // Check for errors in the response
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to fetch users');
    }

    // Adjust based on your actual API response structure
    // Assuming your API returns data in a standard format:
    // { content: [], totalElements: number, totalPages: number, number: number }
    const data = response?.data || response;
    
    if (data) {
      users.value = data.content || data.items || data.data || [];
      totalItems.value = data.totalElements || data.total || data.totalItems || 0;
      totalPages.value = data.totalPages || Math.ceil(totalItems.value / itemsPerPage.value) || 0;
      currentPage.value = data.number || data.page || 0;
    } else {
      // Fallback if response structure is different
      users.value = response || [];
      totalItems.value = users.value.length;
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
    }
    
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = err.message || 'Failed to load users. Please try again.';
    
    // If unauthorized, redirect to login
    if (err.message?.includes('401') || err.message?.includes('Unauthorized') || 
        err.response?.status === 401) {
      await authStore.logout();
      router.push('/login');
    }
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
const filteredUsers = computed(() => users.value);

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
  const start = currentPage.value * itemsPerPage.value + 1;
  return Math.min(start, totalItems.value);
});

const endItem = computed(() => {
  const end = (currentPage.value + 1) * itemsPerPage.value;
  return Math.min(end, totalItems.value);
});

// User actions
async function viewUser(user) {
  selectedUserId.value = user.id;
  isEditMode.value = false;
  showEditModal.value = true;
}

async function editUser(user) {
  selectedUserId.value = user.id;
  isEditMode.value = true;
  showEditModal.value = true;
}

async function deleteUser(user) {
  if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
    return;
  }

  try {
    loading.value = true;
    const response = await userService.deleteUser(user.id);
    
    // Check for errors in the response
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to delete user');
    }

    successMessage.value = `User "${user.username}" deleted successfully!`;
    showSuccessModal.value = true;
    
    await fetchUsers(); // Refresh the list
  } catch (err) {
    console.error('Error deleting user:', err);
    alert(err.message || 'Failed to delete user');
  } finally {
    loading.value = false;
  }
}

async function addUser(newUser) {
  try {
    loading.value = true;
    const response = await userService.createUser(newUser);
    
    // Check for errors in the response
    if (response && response.success === false) {
      throw new Error(response.message || 'Failed to create user');
    }

    showAddModal.value = false;
    successMessage.value = 'User has been created successfully!';
    showSuccessModal.value = true;
    
    await fetchUsers(); // Refresh the list
  } catch (err) {
    console.error('Error creating user:', err);
    alert(err.message || 'Failed to create user');
  } finally {
    loading.value = false;
  }
}

// Handle modal close
const handleModalClose = () => {
  showEditModal.value = false;
  selectedUserId.value = null;
}

// Handle user update success
const handleUserUpdateSuccess = async (data) => {
  successMessage.value = data.message;
  showSuccessModal.value = true;
  await fetchUsers(); // Refresh the list
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  fetchUsers();
});

// Watch for pagination changes
watch([currentPage, itemsPerPage], () => {
  fetchUsers();
}, { immediate: false });

// Also watch for search query changes to reset pagination
watch(searchQuery, (newVal) => {
  if (newVal === '') {
    currentPage.value = 0;
    fetchUsers();
  }
});
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>