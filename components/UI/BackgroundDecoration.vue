<template>
  <div class="absolute bottom-0 right-0 pointer-events-none z-0 overflow-hidden">
    <div class="decoration-image">
      <img
        :src="imageSrc"
        :alt="alt"
        class="w-full h-full object-contain"
        @error="handleImageError"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  image: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'Background decoration'
  },
  opacity: {
    type: Number,
    default: 100
  }
});

const imageError = ref(false);
const fallbackImage = '/svg/cnb_building.svg'; // Fallback path

const imageSrc = computed(() => {
  if (imageError.value) {
    return fallbackImage;
  }
  
  if (props.image) {
    return props.image;
  }
  
  // Try to use the asset, but handle potential failures
  try {
    return new URL('/svg/cnb_building.svg', import.meta.url).href;
  } catch (error) {
    console.warn('Asset resolution failed, using fallback:', error);
    return fallbackImage;
  }
});

const handleImageError = () => {
  console.warn('Image failed to load:', imageSrc.value);
  imageError.value = true;
};
</script>

<style scoped>
.decoration-image {
  opacity: v-bind(opacity / 100);
}
</style>