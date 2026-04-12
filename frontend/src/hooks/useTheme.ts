import { ref } from 'vue'

import { THEME_STORAGE_KEY, DEFAULT_THEME } from '@/constants/theme'

import type { ThemeMode } from '@/types/news'

export const useTheme = () => {
  const theme = ref<ThemeMode>(DEFAULT_THEME)

  const applyTheme = (mode: ThemeMode) => {
    theme.value = mode
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const initializeTheme = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
      return
    }

    applyTheme(DEFAULT_THEME)
  }

  return {
    theme,
    toggleTheme,
    initializeTheme,
  }
}
