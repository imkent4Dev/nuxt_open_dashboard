<template>
  <!-- <header class=" bg-opacity-20 rounded-2xl sticky top-4 z-10"> -->
  <header class=" bg-opacity-20 rounded-2xl  z-10">
    <!-- <div class="flex items-center justify-between px-4 lg:px-6 py-4"> -->
    <div class="flex items-center justify-between ">
      <!-- Left section -->
      <div class="flex items-center space-x-4">
        <!-- Sidebar toggle -->
        <button @click="$emit('toggleSidebar')"
          class="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-30 transition-all duration-200">
          <Bars3Icon class="w-5 h-5" />
        </button>

        <!-- Welcome Message -->
        <div class="hidden sm:block">
          <h1 class="text-xl font-semibold text-gray-800">
            Hi {{ getFirstName(authStore.getUserName) }}, 👋
          </h1>
          <p class="text-sm text-gray-600">Welcome back to your workspace</p>
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center space-x-3">
        <!-- Search (mobile) -->
        <!-- <button
          class="sm:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-30 transition-all duration-200"
          @click="showMobileSearch = !showMobileSearch">
          <MagnifyingGlassIcon class="w-5 h-5" />
        </button> -->

        <!-- Search (desktop) -->
        <!-- <div class="hidden sm:block relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input v-model="searchQuery" type="search" placeholder="Search..."
            class="block w-full pl-9 pr-3 py-2 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent sm:w-48 lg:w-64 backdrop-blur-sm" />
        </div> -->

        <!-- Theme toggle (optional) -->
        <UIThemeToggle v-if="showThemeToggle" />

        <!-- Notifications -->
        <button
          class="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-30 transition-all duration-200 relative">
          <BellIcon class="w-5 h-5" />
          <span v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {{ notificationCount }}
          </span>
        </button>

        <!-- User menu -->
        <div class="relative">
          <button @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition-all duration-200">

            <img :src="authStore.user?.avatar || defaultAvatar" :alt="authStore.getUserName"
              class="w-8 h-8 rounded-full border-2 border-white border-opacity-50" />

            <ChevronDownIcon class="w-4 h-4 text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }" />
          </button>

          <!-- User dropdown -->
          <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-30 py-2 z-20">
              <!-- User info -->
              <div class="px-4 py-3 border-b border-gray-200 border-opacity-50">
                <p class="text-sm font-medium text-gray-800">
                  {{ authStore.getUserName }}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  {{ authStore.getUserEmail }}
                </p>
              </div>

              <!-- Menu items -->
              <NuxtLink to="/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 transition-colors duration-150">
                <UserIcon class="w-4 h-4 mr-3 text-gray-500" />
                View Profile
              </NuxtLink>

              <NuxtLink to="/settings"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 transition-colors duration-150">
                <CogIcon class="w-4 h-4 mr-3 text-gray-500" />
                Account Settings
              </NuxtLink>

              <NuxtLink to="/help"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 transition-colors duration-150">
                <QuestionMarkCircleIcon class="w-4 h-4 mr-3 text-gray-500" />
                Help & Support
              </NuxtLink>

              <div class="border-t border-gray-200 border-opacity-50 my-2"></div>

              <button @click="handleLogout"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:bg-opacity-50 transition-colors duration-150">
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                Sign out
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile search bar -->
    <Transition enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2">
      <div v-show="showMobileSearch" class="sm:hidden px-4 pb-4 border-t border-white border-opacity-20">
        <div class="relative mt-3">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input v-model="searchQuery" type="search" placeholder="Search..."
            class="block w-full pl-9 pr-3 py-2 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent backdrop-blur-sm" />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import defaultAvatar from '/icons/cnb_logo.png'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

defineEmits(['toggleSidebar'])

const authStore = useAuthStore()
const searchQuery = ref('')
const showUserMenu = ref(false)
const showMobileSearch = ref(false)
const notificationCount = ref(3) // You can make this dynamic
const showThemeToggle = ref(false) // Set to true if you want theme toggle

// Helper function to get first name
const getFirstName = (fullName) => {
  if (!fullName) return 'User'
  return fullName.split(' ')[0]
}

// Handle logout
const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  await navigateTo('/login')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Close mobile search when clicking outside
const handleMobileSearchClickOutside = (event) => {
  if (!event.target.closest('.sm\\:hidden')) {
    showMobileSearch.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('click', handleMobileSearchClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('click', handleMobileSearchClickOutside)
})

// Watch for route changes to close mobile search
watch(() => useRoute().path, () => {
  showMobileSearch.value = false
})
</script>