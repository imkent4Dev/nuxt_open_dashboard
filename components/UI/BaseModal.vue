<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3 border-b">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <slot />
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-2 px-4 py-3 border-t">
        <slot name="footer">
          <!-- Default buttons if none provided -->
          <button
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
})
defineEmits(["close", "confirm"])
</script>
