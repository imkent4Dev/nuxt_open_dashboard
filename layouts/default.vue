<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-400 flex">
    <!-- Sidebar -->
    <LayoutSidebar :is-open="sidebarOpen" @toggle="toggleSidebar" @close="closeSidebar" class="flex-shrink-0" />

    <!-- Main content wrapper -->
    <div class="flex-1 transition-all duration-300 ease-in-out p-4 lg:p-6"
      :class="sidebarOpen ? 'lg:pl-72' : 'lg:pl-6'">
      <!-- Rounded container for header + main content -->
      <div class="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-6">

        <!-- Header -->
        <LayoutHeader @toggle-sidebar="toggleSidebar" />

        <!-- Page content -->
        <main class="mt-4">
          <slot />
        </main>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-show="sidebarOpen && isMobile"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 lg:hidden z-20 backdrop-blur-sm" @click="closeSidebar" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sidebarOpen = ref(true)
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Handle client-only viewport checks
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
    sidebarOpen.value = !isMobile.value // open by default on desktop
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)
  onUnmounted(() => window.removeEventListener('resize', checkMobile))
})
</script>
