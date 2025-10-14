<template>
  <!-- <aside
  v-show="isOpen"
  class="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-orange-300 to-red-400 z-30 overflow-hidden flex flex-col"
> --> 
<aside
  v-show="isOpen"
  class="fixed left-0 top-0 h-full w-64 z-30 overflow-hidden flex flex-col bg-transparent"
>

  <!-- Logo -->
  <div class="p-4 border-b border-white border-opacity-20 flex flex-col items-center">
    <div class="w-24 h-24 bg-white rounded-full flex p-2 mb-2">
      <img src="/icons/cnb_logo.png" alt="CNB Logo" class="w-full h-full object-contain" />
    </div>
    <div class="text-center text-gradient font-bold">COLLATERAL EVALUATION</div>
  </div>

  <!-- Navigation -->
  <nav class="mt-6 flex-1 overflow-y-auto px-0 custom-scrollbar">
    <ul class="space-y-2 pb-20">
      <li v-for="item in navigation" :key="item.name">
        <NuxtLink
          :to="item.href"
          class="relative flex items-center px-3 py-3 rounded-lg text-gray-800 transition-all duration-200 group hover:bg-white hover:bg-opacity-10"
        >
          <!-- Active left border -->
          <div v-if="$route.path === item.href" class="absolute left-0 top-0 bottom-0 w-2 bg-white rounded-r-full"></div>

          <!-- Icon -->
          <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            <img :src="item.icon" :alt="item.name" class="w-5 h-5 object-contain" />
          </div>

          <!-- Text -->
          <span class="ml-3 font-medium text-sm transition-opacity duration-300">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</aside>

</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle', 'close'])

const authStore = useAuthStore()

// Navigation items with SVG icons
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '/icons/dashboard.png', hasSubmenu: false },
  // { name: 'Property Map', href: '/property-map', icon: '/icons/property-map.png', hasSubmenu: false },
  { name: 'Customer', href: '/customer', icon: '/icons/customer.png', hasSubmenu: false },
  // { name: 'Branch Request', href: '/branch-request', icon: '/icons/branch-request.png', hasSubmenu: false },
  { name: 'Property', href: '/property', icon: '/icons/property.png', hasSubmenu: false },
  // { name: 'Evaluation By Branch', href: '/evaluation-branch', icon: '/icons/evaluation.png', hasSubmenu: false },
  // { name: 'Evaluation By SME', href: '/evaluation-sme', icon: '/icons/evaluation.png', hasSubmenu: false },
  // { name: 'Evaluation By Mega', href: '/evaluation-mega', icon: '/icons/evaluation.png', hasSubmenu: false },
  // { name: 'Evaluation By Agency', href: '/evaluation-agency', icon: '/icons/evaluation.png', hasSubmenu: false },
  // { name: 'Reports', href: '/reports', icon: '/icons/reports.png', hasSubmenu: true, submenuOpen: false },
]
</script>

<style scoped>
/* Optional: smooth sidebar transition */
.sidebar-transition {
  transition: all 0.3s ease-in-out;
}

/* Optional: customize scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
