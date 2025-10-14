<template>
  <div class="space-y-3">
    <div class="flex flex-col items-start space-y-1">
      <div class="w-45 h-45 lg:w-32">
        <img 
          :src="resolvedLogo" 
          :alt="logoAlt" 
          class="w-full h-full object-contain"
          @error="onLogoError"
        />
      </div>
      <h2 class="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r text-gradient">
        {{ title }}
      </h2>
    </div>
    <p class="text-base lg:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r text-gradient">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  logo: {
    type: String,
    default: ''
  },
  logoAlt: {
    type: String,
    default: 'Company logo'
  },
  title: {
    type: String,
    default: 'CENTER OF EXCELLENCE'
  },
  subtitle: {
    type: String,
    default: 'Banking Anywhere'
  }
});

// Use Nuxt's asset resolution
const resolvedLogo = computed(() => {
  if (props.logo && !props.logo.startsWith('@/') && !props.logo.startsWith('~/')) {
    return props.logo;
  }
  
  // For Nuxt, handle both server and client side
  if (process.client) {
    // Client-side: try to import the asset
    try {
      return new URL('/images/logo.png', import.meta.url).href;
    } catch {
      return '/images/logo.png';
    }
  } else {
    // Server-side: use public path
    return '/images/logo.png';
  }
});

const onLogoError = (event) => {
  console.warn('Logo image failed to load');
  // Try fallback
  if (event.target.src !== '/images/logo.png') {
    event.target.src = '/images/logo.png';
  }
};
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(to right, #dc2626, #ea580c);
}

@media (prefers-color-scheme: dark) {
  .text-gradient {
    background-image: linear-gradient(to right, #f87171, #fb923c);
  }
}
</style>