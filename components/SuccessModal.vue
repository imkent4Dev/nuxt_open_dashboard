<!-- components/SuccessModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <!-- Title -->
        <h3 v-if="title" class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        
        <!-- Message -->
        <p v-if="message" class="text-gray-600 mb-6">{{ message }}</p>
        
        <!-- Actions -->
        <div class="flex flex-col space-y-3">
          <button
            @click="$emit('close')"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Continue
          </button>
          <button
            v-if="showSecondary"
            @click="$emit('secondary')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            {{ secondaryText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Success!'
  },
  message: {
    type: String,
    default: 'Operation completed successfully.'
  },
  showSecondary: {
    type: Boolean,
    default: false
  },
  secondaryText: {
    type: String,
    default: 'Go Back'
  }
})

defineEmits(['close', 'secondary'])
</script>