<template>
  <div class="flex items-center justify-center min-h-[400px]">
    <div class="relative w-full max-w-md">
      <!-- Pie Chart -->
      <div v-if="chartType === 'pie'" class="flex items-center justify-center">
        <div class="relative">
          <!-- SVG Pie Chart -->
          <svg width="300" height="300" viewBox="0 0 300 300" class="transform -rotate-90">
            <circle
              v-for="(segment, index) in pieSegments"
              :key="index"
              cx="150"
              cy="150"
              r="80"
              fill="none"
              :stroke="segment.color"
              stroke-width="40"
              :stroke-dasharray="segment.dashArray"
              :stroke-dashoffset="segment.dashOffset"
              class="transition-all duration-500 hover:stroke-width-45"
            />
          </svg>

          <!-- Center text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">
                {{ totalValue.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="ml-8 space-y-3">
          <div 
            v-for="(item, index) in chartData.labels"
            :key="index"
            class="flex items-center space-x-3 group cursor-pointer"
            @mouseover="highlightSegment(index)"
            @mouseleave="clearHighlight"
          >
            <div 
              class="w-4 h-4 rounded-full transition-transform duration-200 group-hover:scale-110"
              :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"
            ></div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-700">
                {{ item }}
              </div>
              <div class="text-xs text-gray-500">
                {{ chartData.datasets[0].data[index].toLocaleString() }}
              </div>
            </div>
            <div class="text-sm font-semibold text-gray-600">
              {{ getPercentage(chartData.datasets[0].data[index]) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Bar Chart -->
      <div v-else-if="chartType === 'bar'" class="w-full">
        <div class="space-y-4">
          <div 
            v-for="(item, index) in chartData.labels"
            :key="index"
            class="group"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ item }}</span>
              <span class="text-sm text-gray-600">
                {{ chartData.datasets[0].data[index].toLocaleString() }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                :style="{ 
                  width: getPercentage(chartData.datasets[0].data[index]) + '%',
                  backgroundColor: chartData.datasets[0].backgroundColor[index]
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Chart Placeholder -->
      <div v-else-if="chartType === 'line'" class="w-full h-80 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <div class="text-lg mb-2">📈</div>
          <div>Line chart coming soon</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartType: {
    type: String,
    default: 'pie',
    validator: (value) => ['pie', 'bar', 'line'].includes(value)
  }
})

// Computed properties
const totalValue = computed(() => {
  return props.chartData.datasets[0].data.reduce((sum, value) => sum + value, 0)
})

// Calculate pie chart segments
const pieSegments = computed(() => {
  const data = props.chartData.datasets[0].data
  const colors = props.chartData.datasets[0].backgroundColor
  const total = totalValue.value
  const circumference = 2 * Math.PI * 80 // radius = 80
  
  let cumulativeOffset = 0
  
  return data.map((value, index) => {
    const percentage = value / total
    const dashLength = circumference * percentage
    const dashOffset = -cumulativeOffset
    
    cumulativeOffset += dashLength
    
    return {
      color: colors[index],
      dashArray: `${dashLength} ${circumference}`,
      dashOffset: dashOffset
    }
  })
})

// Helper functions
const getPercentage = (value) => {
  const percentage = (value / totalValue.value) * 100
  return Math.round(percentage * 10) / 10 // Round to 1 decimal place
}

const highlightSegment = (index) => {
  // Add highlight effect if needed
  console.log(`Highlighting segment ${index}`)
}

const clearHighlight = () => {
  // Clear highlight effect
  console.log('Clearing highlight')
}
</script>

<style scoped>
/* Smooth transitions for chart interactions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effect for pie segments */
circle:hover {
  filter: brightness(1.1);
}
</style>