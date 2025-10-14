export const useI18nHelpers = () => {
  const { locale, locales, setLocale, t } = useI18n()
  
  // Get current locale
  const currentLocale = computed(() => locale.value)
  
  // Get available locales
  const availableLocales = computed(() => locales.value)
  
  // Switch language with localStorage persistence
  const switchLanguage = async (newLocale) => {
    try {
      await setLocale(newLocale)
      
      // Persist to localStorage
      if (process.client) {
        localStorage.setItem('preferred-language', newLocale)
        
        // Update HTML lang attribute
        document.documentElement.lang = newLocale
        
        // Update document title based on language
        const title = t('common.dashboard')
        document.title = `${title} - Nuxt 3`
      }
    } catch (error) {
      console.error('Failed to switch language:', error)
    }
  }
  
  // Initialize language from localStorage
  const initializeLanguage = () => {
    if (process.client) {
      const stored = localStorage.getItem('preferred-language')
      if (stored && stored !== locale.value) {
        switchLanguage(stored)
      }
      
      // Set HTML lang attribute
      document.documentElement.lang = locale.value
    }
  }
  
  // Get language display name
  const getLanguageName = (code) => {
    const localeObj = availableLocales.value.find(l => l.code === code)
    return localeObj?.name || code
  }
  
  // Check if current language is RTL (for future Arabic support)
  const isRTL = computed(() => {
    const rtlLanguages = ['ar', 'he', 'fa']
    return rtlLanguages.includes(currentLocale.value)
  })
  
  return {
    currentLocale,
    availableLocales,
    switchLanguage,
    initializeLanguage,
    getLanguageName,
    isRTL,
    t
  }
}