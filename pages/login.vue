<template>
  <div class="min-h-screen flex flex-col lg:flex-row relative">
    
    <!-- Left side - Image (Desktop only) -->
    <div class="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div class="absolute inset-0">
        <img src="/images/login_bg.png" alt="Login illustration" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-transparent"></div>
      </div>
    </div>

    <!-- Right side - Login Form -->
    <div class="flex-1 lg:w-3/5 flex items-center justify-center p-4 sm:p-6 bg-white dark:bg-gray-900 relative">
      
      <!-- Background Decoration -->
      <div class="absolute bottom-0 right-0 pointer-events-none z-0 overflow-hidden">
        <div class="decoration-image">
          <img src="/svg/cnb_building.svg" alt="Building decoration" class="w-full h-full object-contain" />
        </div>
      </div>

      <div class="max-w-md w-full space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 relative z-10">
        
        <!-- Brand Header -->
        <div class="space-y-3">
          <div class="flex flex-col items-start space-y-1">
            <div class="w-24 h-24 lg:w-32 lg:h-32">
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

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <InputField 
            id="usernameOrEmail" 
            v-model="form.usernameOrEmail" 
            type="text" 
            label="Username or Email" 
            required 
            placeholder="Enter your username or email"
          />

          <InputField 
            id="password" 
            v-model="form.password" 
            type="password" 
            label="Password" 
            required 
            placeholder="Enter your password"
          />

          <ErrorAlert :show="!!error" :message="error" />

          <div class="w-full p-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-opacity hover:opacity-80"
            >
              <template v-if="authStore.loading">
                <svg class="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-base font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Logging in...
                </span>
              </template>

              <template v-else>
                <span class="text-base font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent uppercase tracking-wide">
                  LOGIN
                </span>
                <img src="/icons/entry.png" alt="Login icon" class="h-5 w-5 object-contain" />
              </template>
            </button>
          </div>
        </form>

        <CopyrightFooter />
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
  middleware: ['auth'] // Changed from 'auth' - login page should use 'guest' middleware
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  usernameOrEmail: 'admin',
  password: 'Admin123@!'
});

const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  // Reset error and set loading
  error.value = '';
  isLoading.value = true;
  
  try {
    const result = await authStore.login(form);
    
    console.log('Login result:', result);
    
    // Check if login was successful
    if (result.success) {
      console.log('Login successful, user data:', authStore.user);
      console.log('Access token:', authStore.accessToken);
      console.log('Is authenticated:', authStore.isAuthenticated);
      
      // Optional: Show success message briefly before redirect
      // await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to dashboard
      await navigateTo('/dashboard', { replace: true });
    } else {
      // Handle login failure
      error.value = result.error || 'Login failed. Please check your credentials.';
      console.error('Login failed:', result.error);
    }
  } catch (err) {
    // Handle unexpected errors
    error.value = err.message || 'An unexpected error occurred. Please try again.';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Check if already authenticated on mount
onMounted(() => {
  authStore.initializeAuth();
  
  // If user is already logged in, redirect to dashboard
  if (authStore.isAuthenticated) {
    console.log('User already authenticated, redirecting to dashboard');
    navigateTo('/dashboard', { replace: true });
  }
});

// Watch for authentication changes
watch(() => authStore.isAuthenticated, (newVal) => {
  console.log('Authentication status changed:', newVal);
  if (newVal) {
    console.log('User authenticated:', authStore.user);
  }
});
</script>
