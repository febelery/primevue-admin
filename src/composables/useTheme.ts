import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'system'
const THEME_STORAGE_KEY = 'theme'
export const DARK_CLASS = 'p-dark'

const theme = ref<Theme>('system')
const isDark = ref(false)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

// 应用对应主题
const applyTheme = (preference: Theme) => {
  if (preference === 'dark') {
    enableDark()
  } else if (preference === 'light') {
    disableDark()
  } else {
    // system
    if (mediaQuery.matches) {
      enableDark()
    } else {
      disableDark()
    }
  }
}

const enableDark = () => {
  document.documentElement.classList.add(DARK_CLASS)
  isDark.value = true
}

const disableDark = () => {
  document.documentElement.classList.remove(DARK_CLASS)
  isDark.value = false
}

const setTheme = (value: Theme) => {
  theme.value = value
  localStorage.setItem(THEME_STORAGE_KEY, value)
  applyTheme(value)
}

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
}

const initTheme = () => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme
  theme.value = saved || (mediaQuery.matches ? 'dark' : 'system')
  applyTheme(theme.value)

  if (theme.value === 'system') {
    mediaQuery.addEventListener('change', () => applyTheme('system'))
  }
}

export const useTheme = () => {
  return {
    theme,
    isDarkMode: computed(() => isDark.value),
    setTheme,
    toggleTheme,
    initTheme,
  }
}
