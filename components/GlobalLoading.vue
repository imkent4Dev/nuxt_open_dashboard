<template>
  <div v-if="isLoading" class="global-loading">
    <div class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isLoading = ref(false)
const nuxtApp = useNuxtApp()

// Listen to route changes to show/hide loading
const startLoading = () => {
  isLoading.value = true
}

const finishLoading = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 300) // Small delay for smooth transition
}

onMounted(() => {
  // Add event listeners for route changes
  const router = useRouter()
  router.beforeEach(() => {
    startLoading()
  })
  
  router.afterEach(() => {
    finishLoading()
  })
  
  // Also listen to manual loading triggers
  nuxtApp.$loading = false
  nuxtApp.hook('app:mounted', finishLoading)
})

onUnmounted(() => {
  const router = useRouter()
  router.beforeEach(() => {})
  router.afterEach(() => {})
})
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #333;
  font-size: 1rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Optional: Add fade transition */
.global-loading {
  transition: opacity 0.3s ease;
}

.global-loading:not([style*="display: none"]) {
  opacity: 1;
}
</style>