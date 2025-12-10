<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div class="text-center">
      <!-- Animated Logo or Icon -->
      <div class="mb-8">
        <div class="relative w-24 h-24 mx-auto">
          <!-- Spinning Circle -->
          <div class="absolute inset-0 border-4 border-white/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          
          <!-- Center Icon -->
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading Text -->
      <h2 class="text-2xl font-bold text-white mb-2">
        Loading...
      </h2>
      <p class="text-white/80 text-sm">
        {{ statusMessage }}
      </p>

      <!-- Progress Dots -->
      <div class="flex justify-center space-x-2 mt-6">
        <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth.js'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()
const statusMessage = ref('Checking authentication...')

const checkAuthAndRedirect = async () => {
  try {
    // Initialize auth from localStorage
    authStore.initializeAuth()
    
    // Give a brief moment for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if user is authenticated
    if (authStore.isAuthenticated) {
      console.log('✅ User authenticated, redirecting to dashboard')
      statusMessage.value = 'Authenticated! Redirecting...'
      
      // Check if token is expired by trying to refresh
      try {
        // Optionally verify token is still valid
        await new Promise(resolve => setTimeout(resolve, 300))
        await navigateTo('/dashboard', { replace: true })
      } catch (error) {
        console.log('⚠️ Token may be expired, refreshing...')
        statusMessage.value = 'Refreshing session...'
        
        const refreshed = await authStore.refreshAccessToken()
        
        if (refreshed) {
          console.log('✅ Token refreshed, redirecting to dashboard')
          await navigateTo('/dashboard', { replace: true })
        } else {
          console.log('❌ Token refresh failed, redirecting to login')
          statusMessage.value = 'Session expired. Redirecting to login...'
          await new Promise(resolve => setTimeout(resolve, 500))
          await navigateTo('/login', { replace: true })
        }
      }
    } else {
      console.log('❌ No authentication found, redirecting to login')
      statusMessage.value = 'Not authenticated. Redirecting to login...'
      await new Promise(resolve => setTimeout(resolve, 500))
      await navigateTo('/login', { replace: true })
    }
  } catch (error) {
    console.error('❌ Error during auth check:', error)
    statusMessage.value = 'Error occurred. Redirecting to login...'
    await new Promise(resolve => setTimeout(resolve, 500))
    await navigateTo('/login', { replace: true })
  }
}

// Run on mount
onMounted(() => {
  checkAuthAndRedirect()
})
</script>

<style scoped>
/* Custom animation delays for dots */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>