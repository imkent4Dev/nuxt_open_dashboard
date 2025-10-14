<template>
  <div
    v-if="show"
    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
  >
    <p class="text-sm text-red-700 dark:text-red-300">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
});
</script>