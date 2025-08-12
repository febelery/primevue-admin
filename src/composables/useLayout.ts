import { updatePrimaryPalette, updateSurfacePalette } from '@primeuix/themes'
import { computed, ref, watch } from 'vue'

// 存储键名
const LAYOUT_STORAGE_KEY = 'layout-config'
const THEME_STORAGE_KEY = 'theme-config'

// 类型定义
export type Theme = 'light' | 'dark' | 'system'
export type LayoutMode = 'static' | 'overlay' | 'slim' | 'horizontal'
export type SidebarPosition = 'left' | 'right'

export const DARK_CLASS = 'p-dark'

// 布局配置接口
export interface LayoutConfig {
  mode: LayoutMode
  sidebar: {
    enabled: boolean
    collapsed: boolean
    position: SidebarPosition
    overlay: boolean
  }
  animations: boolean
  ripple: boolean
}

// 主题配置接口
export interface ThemeConfig {
  theme: Theme
  primary: string
  surface: string | null
  isDark: boolean
}

// 默认配置
const defaultLayoutConfig: LayoutConfig = {
  mode: 'static',
  sidebar: {
    enabled: true,
    collapsed: false,
    position: 'left',
    overlay: false,
  },
  animations: true,
  ripple: true,
}

const defaultThemeConfig: ThemeConfig = {
  theme: 'system',
  primary: 'emerald',
  surface: null,
  isDark: false,
}

// 响应式状态
const layoutConfig = ref<LayoutConfig>({ ...defaultLayoutConfig })
const themeConfig = ref<ThemeConfig>({ ...defaultThemeConfig })

// 媒体查询
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

// 颜色名称中文映射
const colorNameMap: Record<string, string> = {
  // 主题色彩
  emerald: '翡翠绿',
  blue: '蓝色',
  indigo: '靛蓝',
  purple: '紫色',
  pink: '粉色',
  red: '红色',
  orange: '橙色',
  amber: '琥珀',
  yellow: '黄色',
  lime: '青柠',
  green: '绿色',
  teal: '青色',
  cyan: '青蓝',
  sky: '天蓝',
  violet: '紫罗兰',
  fuchsia: '紫红',
  rose: '玫瑰',
  // 表面色彩
  slate: '石板灰',
  gray: '灰色',
  zinc: '锌灰',
  neutral: '中性灰',
  stone: '石灰',
}

// 主题色彩配置
const primaryColors = ref([
  {
    name: 'emerald',
    label: colorNameMap.emerald,
    palette: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
  },
  {
    name: 'blue',
    label: colorNameMap.blue,
    palette: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
  {
    name: 'indigo',
    label: colorNameMap.indigo,
    palette: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
  },
  {
    name: 'purple',
    label: colorNameMap.purple,
    palette: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
  },
  {
    name: 'pink',
    label: colorNameMap.pink,
    palette: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
  },
  {
    name: 'orange',
    label: colorNameMap.orange,
    palette: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
  },
  {
    name: 'green',
    label: colorNameMap.green,
    palette: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
  },
  {
    name: 'teal',
    label: colorNameMap.teal,
    palette: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
  },
])

const surfaces = ref([
  {
    name: 'slate',
    label: colorNameMap.slate,
    palette: {
      0: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  {
    name: 'gray',
    label: colorNameMap.gray,
    palette: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
  {
    name: 'zinc',
    label: colorNameMap.zinc,
    palette: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  {
    name: 'neutral',
    label: colorNameMap.neutral,
    palette: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
])

// 主题应用函数
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
  themeConfig.value.isDark = true
}

const disableDark = () => {
  document.documentElement.classList.remove(DARK_CLASS)
  themeConfig.value.isDark = false
}

// 持久化函数
const saveLayoutConfig = () => {
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutConfig.value))
}

const saveThemeConfig = () => {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeConfig.value))
}

const loadLayoutConfig = () => {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      layoutConfig.value = { ...defaultLayoutConfig, ...parsed }
    }
  } catch (error) {
    console.warn('Failed to load layout config:', error)
    layoutConfig.value = { ...defaultLayoutConfig }
  }
}

const loadThemeConfig = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      themeConfig.value = { ...defaultThemeConfig, ...parsed }
    } else {
      // 如果没有保存的配置，根据系统偏好设置默认主题
      themeConfig.value.theme = mediaQuery.matches ? 'dark' : 'system'
    }
  } catch (error) {
    console.warn('Failed to load theme config:', error)
    themeConfig.value = { ...defaultThemeConfig }
  }
}

// 监听配置变化并自动保存
watch(layoutConfig, saveLayoutConfig, { deep: true })
watch(themeConfig, saveThemeConfig, { deep: true })

export function useLayout() {
  // 布局相关方法
  const setLayoutMode = (mode: LayoutMode) => {
    layoutConfig.value.mode = mode
  }

  const toggleSidebar = () => {
    layoutConfig.value.sidebar.collapsed = !layoutConfig.value.sidebar.collapsed
  }

  const setSidebarPosition = (position: SidebarPosition) => {
    layoutConfig.value.sidebar.position = position
  }

  // 主题相关方法
  const setTheme = (theme: Theme) => {
    themeConfig.value.theme = theme
    applyTheme(theme)
  }

  const toggleTheme = () => {
    const newTheme = themeConfig.value.isDark ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const setPrimary = (colorName: string) => {
    themeConfig.value.primary = colorName
    const color = primaryColors.value.find((c) => c.name === colorName)
    if (color) {
      updatePrimaryPalette(color.palette)
    }
  }

  const setSurface = (colorName: string | null) => {
    themeConfig.value.surface = colorName
    if (colorName) {
      const surface = surfaces.value.find((s) => s.name === colorName)
      if (surface) {
        updateSurfacePalette(surface.palette)
      }
    }
  }

  const updateColors = (type: 'primary' | 'surface', colorName: string) => {
    if (type === 'primary') {
      setPrimary(colorName)
    } else if (type === 'surface') {
      setSurface(colorName)
    }
  }

  // 重置配置
  const resetToDefault = () => {
    layoutConfig.value = { ...defaultLayoutConfig }
    themeConfig.value = { ...defaultThemeConfig }
    applyTheme(themeConfig.value.theme)

    // 重置颜色
    const defaultPrimary = primaryColors.value.find((c) => c.name === defaultThemeConfig.primary)
    if (defaultPrimary) {
      updatePrimaryPalette(defaultPrimary.palette)
    }
  }

  // 随机主题
  const randomizeTheme = () => {
    const randomPrimary =
      primaryColors.value[Math.floor(Math.random() * primaryColors.value.length)]
    const randomSurface =
      Math.random() > 0.5 ? surfaces.value[Math.floor(Math.random() * surfaces.value.length)] : null

    setPrimary(randomPrimary.name)
    setSurface(randomSurface?.name || null)
  }

  // 初始化
  const initLayout = () => {
    loadLayoutConfig()
    loadThemeConfig()
    applyTheme(themeConfig.value.theme)

    // 应用保存的颜色
    const savedPrimary = primaryColors.value.find((c) => c.name === themeConfig.value.primary)
    if (savedPrimary) {
      updatePrimaryPalette(savedPrimary.palette)
    }

    if (themeConfig.value.surface) {
      const savedSurface = surfaces.value.find((s) => s.name === themeConfig.value.surface)
      if (savedSurface) {
        updateSurfacePalette(savedSurface.palette)
      }
    }

    // 监听系统主题变化
    if (themeConfig.value.theme === 'system') {
      mediaQuery.addEventListener('change', () => applyTheme('system'))
    }
  }

  // 计算属性
  const isDarkMode = computed(() => themeConfig.value.isDark)
  const currentTheme = computed(() => themeConfig.value.theme)
  const currentPrimary = computed(() => themeConfig.value.primary)
  const currentSurface = computed(() => themeConfig.value.surface)
  const currentLayoutMode = computed(() => layoutConfig.value.mode)
  const isSidebarCollapsed = computed(() => layoutConfig.value.sidebar.collapsed)

  return {
    // 配置对象
    layoutConfig: computed(() => layoutConfig.value),
    themeConfig: computed(() => themeConfig.value),

    // 颜色数据
    primaryColors,
    surfaces,

    // 计算属性
    isDarkMode,
    currentTheme,
    currentPrimary,
    currentSurface,
    currentLayoutMode,
    isSidebarCollapsed,

    // 布局方法
    setLayoutMode,
    toggleSidebar,
    setSidebarPosition,

    // 主题方法
    setTheme,
    toggleTheme,
    setPrimary,
    setSurface,
    updateColors,

    // 工具方法
    resetToDefault,
    randomizeTheme,
    initLayout,
  }
}
