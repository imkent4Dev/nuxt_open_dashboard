<template>
  <div class="min-h-screen gradient-bg flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-r">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          A modern dashboard built with Nuxt 3, Tailwind CSS, and Pinia
        </p>

        <div class="space-y-4">
          <NuxtLink to="/dashboard" class="btn-primary w-full block text-center">
            Go to Dashboard
          </NuxtLink>

          <NuxtLink to="/login" class="btn-secondary w-full block text-center">
            Login Page
          </NuxtLink>
        </div>
      </div>

      <!-- Features -->
      <div class="mt-12 grid grid-cols-1 gap-6">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Features Included
          </h3>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>✅ Responsive Layout with Collapsible Sidebar</li>
            <li>✅ Dark/Light Theme Toggle</li>
            <li>✅ Authentication with Pinia Store</li>
            <li>✅ Dashboard Cards and Components</li>
            <li>✅ Custom Tailwind Configuration</li>
            <li>✅ Modern UI with Heroicons</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Don't apply default layout to landing page
definePageMeta({
  layout: false
})

// Initialize theme
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>