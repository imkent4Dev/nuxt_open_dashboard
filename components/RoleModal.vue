<!-- components/RoleModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
      <!-- Header -->
      <div class="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ mode === 'create' ? 'Create New Role' : 'Edit Role' }}</h3>
          <p class="text-sm text-gray-500 mt-1">Define a new role for access control</p>
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
          <!-- Role Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Role Name <span class="text-red-500">*</span>
            </label>
            <div class="flex">
              <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                ROLE_
              </span>
              <input
                v-model="form.name"
                type="text"
                placeholder="ADMIN, MANAGER, USER"
                required
                class="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              >
            </div>
            <p class="text-xs text-gray-500 mt-2">Role name will be prefixed with "ROLE_"</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe the purpose of this role..."
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- System Role -->
          <div v-if="mode === 'create'">
            <label class="flex items-center">
              <input
                v-model="form.isSystemRole"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <span class="ml-2 text-sm text-gray-700">This is a system role</span>
            </label>
            <p class="text-xs text-gray-500 mt-2">System roles have special restrictions and cannot be deleted</p>
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
              {{ mode === 'create' ? 'Create Role' : 'Update Role' }}
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
  role: Object,
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
  name: '',
  description: '',
  isSystemRole: false
})

// Computed
const isFormValid = computed(() => {
  return form.name && form.description
})

// Methods
function handleSubmit() {
  const roleData = {
    ...form,
    name: `ROLE_${form.name.toUpperCase()}`
  }

  if (props.mode === 'edit') {
    roleData.id = form.id
  }

  emit('submit', roleData, props.mode)
}

function resetForm() {
  form.id = null
  form.name = ''
  form.description = ''
  form.isSystemRole = false
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal && props.role) {
    // Edit mode - populate form
    form.id = props.role.id
    form.name = props.role.name.replace('ROLE_', '')
    form.description = props.role.description
    form.isSystemRole = props.role.isSystemRole
  } else if (newVal && !props.role) {
    // Create mode - reset form
    resetForm()
  }
})
</script>