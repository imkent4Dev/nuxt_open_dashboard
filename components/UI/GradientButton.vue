<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full flex items-center justify-center gap-2 py-4 font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
  >
    <slot>
      <span v-if="loading" class="inline-flex items-center gap-2 text-white">
        <Spinner />
        {{ loadingText }}
      </span>
      <span v-else class="flex items-center gap-2">
        <span class="text-base">{{ text }}</span>
        <img v-if="icon" :src="icon" :alt="iconAlt" class="h-5 w-5 object-contain" />
      </span>
    </slot>
  </button>
</template>

<script setup>
import Spinner from './Spinner.vue';

defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: Boolean,
  loading: Boolean,
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  text: String,
  icon: String,
  iconAlt: String
});
</script>