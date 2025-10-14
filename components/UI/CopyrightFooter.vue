<template>
  <div class="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
    <p class="text-xs text-gray-500 dark:text-gray-400">
      © {{ year }} {{ company }}. All rights reserved.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  company: {
    type: String,
    default: 'Center of Excellence'
  }
});

const year = computed(() => new Date().getFullYear());
</script>