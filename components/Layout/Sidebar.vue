<template>
  <div class="h-full flex flex-col">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">CNB</span>
        </div>
        <div>
          <h1 class="text-lg font-semibold text-gray-900">IM Portal</h1>
          <p class="text-xs text-gray-500">v1.0.0</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-4 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
          :class="isActive(item.href) 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-gray-700 hover:bg-gray-100'"
        >
          <span class="w-5 h-5 mr-3" v-html="item.icon" />
          {{ item.name }}
          
          <!-- Badge (Optional) -->
          <span v-if="item.badge" class="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
            {{ item.badge }}
          </span>
        </NuxtLink>
      </div>

      <!-- Dropdown Section -->
      <div v-for="section in dropdownSections" :key="section.title" class="mt-8">
        <div class="px-4 mb-2">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {{ section.title }}
          </p>
        </div>
        <div class="px-4 space-y-1">
          <NuxtLink
            v-for="item in section.items"
            :key="item.name"
            :to="item.href"
            class="flex items-center px-3 py-2.5 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-gray-100': isActive(item.href) }"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- User Info (Optional) -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center">
        <img
          :src="user.avatar"
          :alt="user.name"
          class="w-8 h-8 rounded-full"
        />
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
          <p class="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

// Sample user data
const user = ref({
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
})

// Navigation items with SVG icons
const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
  },
  {
    name: 'Users',
    href: '/users',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9A5.5 5.5 0 0012 3.5 5.5 5.5 0 006.5 9c0 1.43.56 2.74 1.47 3.7" /></svg>',
    badge: '3'
  },
  {
    name: 'Settings',
    // href: '/settings',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
  }
]

const dropdownSections = [
  {
    title: 'User Management',
    items: [
      { name: 'All Users', href: '/users' },
      { name: 'Add User' },
      { name: 'Roles' },
      { name: 'Permissions' }
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Articles' },
      { name: 'Categories'},
      { name: 'Media' }
    ]
  }
]

const isActive = (href) => {
  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-50 text-blue-700;
}
</style>