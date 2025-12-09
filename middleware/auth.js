export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isLoading } = storeToRefs(useAuthStore())
  
  // Show loading when navigating between pages
  const nuxtApp = useNuxtApp()
  nuxtApp.$loading = true
  
  // Allow access to login page
  if (to.path === '/login') {
    if (isAuthenticated.value) {
      return navigateTo('/dashboard')
    }
    nuxtApp.$loading = false
    return
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    nuxtApp.$loading = false
    return navigateTo('/login')
  }
  
  nuxtApp.$loading = false
})