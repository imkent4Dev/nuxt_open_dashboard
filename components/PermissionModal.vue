<!-- components/PermissionModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ mode === 'create' ? 'Create New Permission' : 'Edit Permission' }}</h3>
          <p class="text-sm text-gray-500 mt-1">Define a new permission for access control</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Module -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Module <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.module"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select a module</option>
              <option value="USER_MANAGEMENT">User Management</option>
              <option value="ROLE_MANAGEMENT">Role Management</option>
              <option value="PERMISSION_MANAGEMENT">Permission Management</option>
              <option value="AUDIT_MANAGEMENT">Audit Management</option>
              <option value="CONTENT_MANAGEMENT">Content Management</option>
              <option value="REPORT_MANAGEMENT">Report Management</option>
            </select>
            <p class="text-xs text-gray-500 mt-2">Module groups related permissions together</p>
          </div>

          <!-- Resource -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Resource <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.resource"
              type="text"
              placeholder="e.g., USER, ROLE, CONTENT"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            >
            <p class="text-xs text-gray-500 mt-2">The resource this permission applies to (uppercase)</p>
          </div>

          <!-- Action -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Action <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.action"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select an action</option>
              <option value="CREATE">Create</option>
              <option value="READ">Read</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>

          <!-- Name (Auto-generated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Permission Name
            </label>
            <input
              :value="generatedName"
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            >
            <p class="text-xs text-gray-500 mt-2">Auto-generated from Resource and Action</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe what this permission allows..."
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'px-6 py-3 rounded-lg font-medium',
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              {{ mode === 'create' ? 'Create Permission' : 'Update Permission' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  permission: Object,
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['close', 'submit'])

// Form state
const form = reactive({
  id: null,
  module: '',
  resource: '',
  action: '',
  description: ''
})

// Computed
const generatedName = computed(() => {
  if (!form.resource || !form.action) return ''
  return `${form.resource}_${form.action}`
})

const isFormValid = computed(() => {
  return form.module && form.resource && form.action && form.description
})

// Methods
function handleSubmit() {
  const permissionData = {
    ...form,
    name: generatedName.value
  }

  if (props.mode === 'edit') {
    permissionData.id = form.id
  }

  emit('submit', permissionData, props.mode)
}

function resetForm() {
  form.id = null
  form.module = ''
  form.resource = ''
  form.action = ''
  form.description = ''
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal && props.permission) {
    // Edit mode - populate form
    form.id = props.permission.id
    form.module = props.permission.module
    form.resource = props.permission.resource
    form.action = props.permission.action
    form.description = props.permission.description
  } else if (newVal && !props.permission) {
    // Create mode - reset form
    resetForm()
  }
})

// Watch resource and action to auto-generate name
watch([() => form.resource, () => form.action], () => {
  // You can add validation or formatting here if needed
})
</script>