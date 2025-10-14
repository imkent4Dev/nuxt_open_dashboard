<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      :title="$t('common.language')"
    >
      <!-- Language flag/icon -->
      <div class="w-5 h-5 rounded-sm overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-600">
        <span class="text-xs font-semibold">
          {{ currentLocale.toUpperCase() }}
        </span>
      </div>
      
      <!-- Language name (desktop only) -->
      <span class="hidden sm:block text-sm font-medium">
        {{ getLanguageName(currentLocale) }}
      </span>
      
      <!-- Dropdown icon -->
      <ChevronDownIcon 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Language dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="showDropdown"
        class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
      >
        <button
          v-for="availableLocale in availableLocales"
          :key="availableLocale.code"
          @click="handleLanguageSwitch(availableLocale.code)"
          class="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{ 
            'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400': currentLocale === availableLocale.code 
          }"
        >
          <!-- Flag placeholder -->
          <div class="w-5 h-5 rounded-sm overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-600 mr-3">
            <span class="text-xs font-semibold">
              {{ availableLocale.code.toUpperCase() }}
            </span>
          </div>
          
          <!-- Language name -->
          <span class="flex-1">{{ availableLocale.name }}</span>
          
          <!-- Check mark for current language -->
          <CheckIcon 
            v-if="currentLocale === availableLocale.code"
            class="w-4 h-4 text-primary-500"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { 
  currentLocale, 
  availableLocales, 
  switchLanguage, 
  getLanguageName 
} = useI18nHelpers()

const showDropdown = ref(false)

// Handle language switch
const handleLanguageSwitch = async (newLocale) => {
  if (newLocale !== currentLocale.value) {
    await switchLanguage(newLocale)
  }
  showDropdown.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      showDropdown.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>