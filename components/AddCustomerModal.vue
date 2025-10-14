<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center 
         bg-black/30 backdrop-blur-sm z-50">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-3xl">
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b">
        <h3 class="text-lg font-semibold">Add New Customer</h3>
        <button @click="$emit('close')" class="text-red-500 hover:text-red-700 text-xl">
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Section -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-md font-semibold mb-1">Customer Information</h4>
          <p class="text-sm text-gray-500">
            Please input following information
          </p>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInputField v-model="form.firstName" label="First Name" required />
            <BaseInputField v-model="form.lastName" label="Last Name" required />
          </div>
          <BaseInputField v-model="form.nid" label="NID" required />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end px-6 py-4 border-t">
        <button @click="handleSubmit" class="px-6 py-2 rounded-lg shadow text-white btn-gradient">
          Submit
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import BaseInputField from '~/components/UI/BaseInputField.vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  firstName: '',
  lastName: '',
  nid: ''
})

function handleSubmit() {
  if (form.firstName && form.lastName && form.nid) {
    emit('submit', { ...form })
    emit('close')
    // Reset form
    form.firstName = ''
    form.lastName = ''
    form.nid = ''
  }
}
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(90deg, #4b6cb7, #182848);
}
</style>
