<template>
  <div class="card p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div 
          class="p-2 rounded-lg"
          :class="iconBgClass"
        >
          <component :is="icon" class="w-6 h-6" :class="iconClass" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <button
          v-if="showTrend"
          class="text-xs px-2 py-1 rounded-full font-medium"
          :class="trendClass"
        >
          {{ trend }}
        </button>
        <button class="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <EllipsisVerticalIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Value -->
      <div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>
        <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ description }}
        </p>
      </div>

      <!-- Progress bar (if provided) -->
      <div v-if="progress !== null" class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Progress</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarClass"
            :style="{ width: `${Math.min(progress, 100)}%` }"
          />
        </div>
      </div>

      <!-- Footer content -->
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: null
  },
  value: {
    type: [String, Number],
    required: true
  },
  description: {
    type: String,
    default: null
  },
  icon: {
    type: [String, Object],
    required: true
  },
  iconColor: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary', 'red', 'yellow', 'green', 'blue', 'purple'].includes(value)
  },
  trend: {
    type: String,
    default: null
  },
  trendDirection: {
    type: String,
    default: 'up',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  progress: {
    type: Number,
    default: null
  }
})

// Computed classes for icon
const iconBgClass = computed(() => {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900',
    secondary: 'bg-secondary-100 dark:bg-secondary-900',
    tertiary: 'bg-tertiary-100 dark:bg-tertiary-900',
    red: 'bg-red-100 dark:bg-red-900',
    yellow: 'bg-yellow-100 dark:bg-yellow-900',
    green: 'bg-green-100 dark:bg-green-900',
    blue: 'bg-blue-100 dark:bg-blue-900',
    purple: 'bg-purple-100 dark:bg-purple-900'
  }
  return colors[props.iconColor] || colors.primary
})

const iconClass = computed(() => {
  const colors = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    tertiary: 'text-tertiary-600 dark:text-tertiary-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400'
  }
  return colors[props.iconColor] || colors.primary
})

// Show trend badge
const showTrend = computed(() => props.trend !== null)

// Trend styling
const trendClass = computed(() => {
  if (!props.trend) return ''
  
  const directions = {
    up: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    down: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return directions[props.trendDirection] || directions.neutral
})

// Progress bar styling
const progressBarClass = computed(() => {
  if (props.progress === null) return ''
  
  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    tertiary: 'bg-tertiary-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }
  return colors[props.iconColor] || colors.primary
})
</script>