<template>
  <div class="p-6">
    
    <div class="mt-4">
      <!-- Page Title -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gradient">Customer</h2>
      </div>

      <!-- Container -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <!-- First row: Search + New Button -->
        <div class="flex items-center justify-between mb-4">
          <div></div>
          <div class="flex items-center">
            <!-- Search -->
            <div class="max-w-xs">
              <input v-model="searchQuery" type="text" placeholder="Search customer..."
                class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
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
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Customer ID</th>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                <th class="px-4 py-2 text-left text-sm font-semibold text-gray-600">NID</th>
                <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(customer, index) in paginatedData" :key="customer.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="border-t hover:bg-gray-100">
                <td class="px-4 py-2 text-sm">{{ customer.id }}</td>
                <td class="px-4 py-2 text-sm">{{ customer.name }}</td>
                <td class="px-4 py-2 text-sm">{{ customer.nid }}</td>
                <td class="px-4 py-2 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Eye -->
                    <button class="p-1.5 hover:bg-blue-50">
                      <EyeIcon class="w-5 h-5 text-blue-500" />
                    </button>
                    <!-- Edit -->
                    <button class="p-1.5 hover:bg-blue-50">
                      <PencilSquareIcon class="w-5 h-5 text-blue-500" />
                    </button>
                    <!-- Delete -->
                    <button class="p-1.5 hover:bg-red-50 rounded-lg">
                      <TrashIcon class="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-end items-center mt-4 space-x-4">
        <!-- Page size dropdown -->
        <div>
          <select v-model="itemsPerPage"
            class="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="30">30 / page</option>
          </select>
        </div>

        <!-- Navigation -->
        <div class="flex items-center space-x-2">
          <!-- Previous -->
          <button @click="prevPage" :disabled="currentPage === 1"
            class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 flex items-center">
            ←
          </button>

          <!-- Page Numbers -->
          <div class="flex space-x-1">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
              'px-3 py-1 rounded-lg border text-sm',
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-100'
            ]">
              {{ page }}
            </button>
          </div>

          <!-- Next -->
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 flex items-center">
            →
          </button>
        </div>
      </div>

      <!-- Add Customer Modal -->
      <div v-if="showAddModal" class="modal show">
        <div class="modal-content">
          <span @click="showAddModal = false" class="float-right text-red-500 cursor-pointer">&times;</span>
          <h3 class="text-lg font-bold mb-4">Add New Customer</h3>
          <div class="mb-4">
            <p class="text-gray-500 mb-2">Customer information</p>
            <p class="text-gray-500 mb-2">Please input following information</p>
            <div class="mb-2">
              <input v-model="newCustomer.firstName" placeholder="First Name"
                class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div class="mb-2">
              <input v-model="newCustomer.lastName" placeholder="Last Name"
                class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div class="mb-2">
              <input v-model="newCustomer.nid" placeholder="NID" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <button @click="addCustomer" class="px-4 py-2 btn-gradient text-white rounded-lg shadow hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal show">
        <div class="modal-content">
          <div class="flex justify-center mb-4">
            <span class="text-green-500 text-4xl">✓</span>
          </div>
          <h3 class="text-lg font-bold mb-2">Successful</h3>
          <p class="text-gray-600 mb-4">You have done Created</p>
          <button @click="showSuccessModal = false"
            class="px-4 py-2 btn-gradient text-white rounded-lg shadow hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

// Demo 20 customers
const customers = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: `C${String(i + 1).padStart(5, '0')}`,
    name: `Customer ${i + 1}`,
    nid: `${100000000 + i}`,
  }))
);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAddModal = ref(false);
const showSuccessModal = ref(false);
const newCustomer = ref({ firstName: '', lastName: '', nid: '' });

const filteredData = computed(() => {
  if (!searchQuery.value) return customers.value;
  return customers.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.nid.includes(searchQuery.value)
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / itemsPerPage.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function goToPage(page) {
  currentPage.value = page;
}
function addCustomer() {
  if (newCustomer.value.firstName && newCustomer.value.lastName && newCustomer.value.nid) {
    customers.value.push({
      id: `C${String(customers.value.length + 1).padStart(5, '0')}`,
      name: `${newCustomer.value.firstName} ${newCustomer.value.lastName}`,
      nid: newCustomer.value.nid,
    });
    showAddModal.value = false;
    newCustomer.value = { firstName: '', lastName: '', nid: '' };
    showSuccessModal.value = true;
  }
}
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
</style>