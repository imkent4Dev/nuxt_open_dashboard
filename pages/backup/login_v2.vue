<template>
  <div class="min-h-screen flex flex-col lg:flex-row relative">
    <!-- Mobile Layout -->
    <div class="w-full lg:hidden flex flex-col min-h-screen">
      <div class="flex-1 flex items-center justify-center p-4 sm:p-6 bg-white dark:bg-gray-900 relative">
        <!-- Background Decoration - Mobile -->
        <div class="absolute bottom-0 right-0 pointer-events-none z-0 overflow-hidden">
          <div class="decoration-image">
            <img
              src="/svg/cnb_building.svg"
              alt="Background decoration"
              class="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div class="max-w-md w-full space-y-8 p-6 lg:p-8 mx-4 relative z-10">
          <!-- Brand Header - Mobile -->
          <div class="space-y-3">
            <div class="flex flex-col items-start space-y-1">
              <div class="w-45 h-45 lg:w-32">
                <img src="/images/logo.png" alt="Company logo" class="w-full h-full object-contain" />
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r text-gradient">
                CENTER OF EXCELLENCE
              </h2>
            </div>
            <p class="text-base lg:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r text-gradient">
              Banking Anywhere
            </p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <InputField
              id="email"
              v-model="form.email"
              type="email"
              label="Email address"
              required
            />
            
            <InputField
              id="password"
              v-model="form.password"
              type="password"
              label="Password"
              required
            />
            
            <ErrorAlert
              :show="!!error"
              :message="error"
            />
            
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex items-center justify-center gap-3 py-4 px-6 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700"
            >
              <span v-if="authStore.loading" class="inline-flex items-center gap-2 text-white">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                <span class="text-base font-bold text-white">LOGIN</span>
                <img 
                  src="/icons/entry.png" 
                  alt="Login icon" 
                  class="h-5 w-5 object-contain brightness-0 invert" 
                />
              </span>
            </button>
          </form>
          
          <CopyrightFooter />
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:flex w-full min-h-screen ">
      <div class="w-2/5 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
        <div class="absolute inset-0">
          <img src="/images/login_bg.png" alt="Login illustration" class="w-full h-full object-cover " />
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-transparent"></div>
        </div>
      </div>
      <div class="w-3/5 flex items-center justify-center bg-green dark:bg-gray-900 relative overflow-hidden">
        <!-- Background Decoration - Desktop -->
        <div class="absolute bottom-0 right-0 pointer-events-none z-0 overflow-hidden">
          <div class="decoration-image">
            <img
              src="/svg/cnb_building.svg"
              alt="Background decoration"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <div class="w-full space-y-8 p-6 lg:p-8 mx-4 relative z-10">
          <!-- Brand Header - Desktop -->
          <div class="space-y-3">
            <div class="flex flex-col items-start space-y-1">
              <div class="w-45 h-45 lg:w-32">
                <img src="/images/logo.png" alt="Company logo" class="w-full h-full object-contain" />
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r text-gradient">
                CENTER OF EXCELLENCE
              </h2>
            </div>
            <p class="text-base lg:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r text-gradient">
              Banking Anywhere
            </p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <InputField
              id="email-desktop"
              v-model="form.email"
              type="email"
              label="Email address"
              required
            />
            
            <InputField
              id="password-desktop"
              v-model="form.password"
              type="password"
              label="Password"
              required
            />
            
            <ErrorAlert
              :show="!!error"
              :message="error"
            />
            
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex items-center justify-center gap-3 py-4 px-6 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700"
            >
              <span v-if="authStore.loading" class="inline-flex items-center gap-2 text-white">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                <span class="text-base font-bold text-white">LOGIN</span>
                <img 
                  src="/icons/entry.png" 
                  alt="Login icon" 
                  class="h-5 w-5 object-contain brightness-0 invert" 
                />
              </span>
            </button>
          </form>
          
          <CopyrightFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputField from '@/components/UI/InputField.vue'
import ErrorAlert from '@/components/UI/ErrorAlert.vue'
import CopyrightFooter from '@/components/UI/CopyrightFooter.vue'

import { useAuthStore } from '~/stores/auth.js'

definePageMeta({
  layout: false,
  middleware: ['auth']
});

const authStore = useAuthStore();
const form = reactive({
  email: 'admin@example.com',
  password: 'password'
});
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  try {
    const result = await authStore.login(form);
    if (result.success) {
      await navigateTo('/dashboard');
    } else {
      error.value = result.error || 'Login failed';
    }
  } catch (err) {
    error.value = 'An unexpected error occurred';
    console.error('Login error:', err);
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

.decoration-image {
  opacity: 1;
}
</style>