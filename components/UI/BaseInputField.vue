<template>
  <div class="relative w-full">
    <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      v-model="internalValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="w-full px-4 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: 'Input Label'
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Computed input ID for accessibility
const inputId = computed(() => `md3-input-${Math.random().toString(36).substr(2, 9)}`)

// Two-way binding
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
/* Tailwind CSS is used globally, no additional styles needed */
</style>