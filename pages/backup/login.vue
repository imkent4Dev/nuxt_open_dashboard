<template>
  <div class="min-h-screen flex flex-col lg:flex-row relative">
    <!-- Mobile Layout -->
    <div class="w-full lg:hidden flex flex-col min-h-screen">
      <div class="flex-1 flex items-center justify-center p-4 sm:p-6 bg-white dark:bg-gray-900 relative">
        <BackgroundDecoration />
        
        <div class="max-w-md w-full space-y-8 p-6 lg:p-8 mx-4 relative z-10">
          <BrandHeader />
          
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
            
            <GradientButton
              type="submit"
              :disabled="authStore.loading"
              :loading="authStore.loading"
              loading-text="Logging in..."
              text="LOGIN"
              icon="/icons/entry.png"
              icon-alt="Login icon"
            />
          </form>
          
          <CopyrightFooter />
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden lg:flex w-full min-h-screen">
      <div class="w-2/5 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
        <div class="absolute inset-0">
          <img src="/images/login_bg.png" alt="Login illustration" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-transparent"></div>
        </div>
      </div>
      <div class="w-3/5 flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden">
        <BackgroundDecoration image="/svg/cnb_building.svg" />
        
        <div class="max-w-md w-full space-y-8 p-6 lg:p-8 mx-4 relative z-10">
          <BrandHeader />
          
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
            
            <GradientButton
              type="submit"
              :disabled="authStore.loading"
              :loading="authStore.loading"
              loading-text="Logging in..."
              text="LOGIN"
              icon="/icons/entry.png"
              icon-alt="Login icon"
            />
          </form>
          
          <CopyrightFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputField from '@/components/UI/InputField.vue'
import GradientButton from '@/components/UI/GradientButton.vue'
import ErrorAlert from '@/components/UI/ErrorAlert.vue'
import BrandHeader from '@/components/UI/BrandHeader.vue'
import CopyrightFooter from '@/components/UI/CopyrightFooter.vue'
import BackgroundDecoration from '@/components/UI/BackgroundDecoration.vue'

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
</style>