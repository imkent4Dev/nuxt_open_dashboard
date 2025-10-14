<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global app initialization can go here if needed
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>