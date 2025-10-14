export const useTheme = () => {
  const isDark = ref(false)

  // Initialize theme on client side
  const initializeTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      isDark.value = stored === 'dark' || (!stored && prefersDark)
      updateTheme()
    }
  }

  // Update theme classes
  const updateTheme = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
    
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    initializeTheme
  }
}