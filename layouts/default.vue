<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar (Desktop) -->
    <aside 
      class="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-200"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <LayoutSidebar :is-open="sidebarOpen" />
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-show="sidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Mobile Sidebar Drawer -->
    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside 
        v-show="sidebarOpen && isMobile"
        class="fixed inset-y-0 left-0 w-64 bg-white z-40 lg:hidden shadow-xl"
      >
        <LayoutSidebar :is-open="sidebarOpen" />
      </aside>
    </Transition>

    <!-- Main Content Area -->
    <div 
      class="flex flex-col min-h-screen transition-all duration-200"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <!-- Header -->
      <header class="sticky top-0 z-20 bg-white border-b border-gray-200">
        <LayoutHeader @toggle-sidebar="toggleSidebar" />
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Optional: Breadcrumb or page title can go here -->
          <div class="mb-6">
            <slot name="header" />
          </div>
          
          <!-- Page Content -->
          <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <slot />
          </div>
          
          <!-- Optional: Footer slot -->
          <div class="mt-6">
            <slot name="footer" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sidebarOpen = ref(true)
const isMobile = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Check if mobile on mount and resize
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  // Auto-close sidebar on mobile, keep open on desktop
  if (isMobile.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>