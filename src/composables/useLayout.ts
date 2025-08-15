import { generatePalette, PRESET_COLORS } from '@/lib/color'
import { updatePrimaryPalette } from '@primeuix/themes'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export type Theme = 'light' | 'dark' | 'system'
export type LayoutMode = 'sidebar-topbar' | 'topbar-only'
export const DARK_CLASS = 'p-dark'

interface LayoutConfig {
  /** 布局模式：侧栏+顶栏 或 仅顶栏 */
  mode: LayoutMode
  sidebar: { enabled: boolean; collapsed: boolean; overlay: boolean }
  /** 是否显示面包屑 */
  showBreadcrumb: boolean
  animations: boolean
  ripple: boolean
}

interface ThemeConfig {
  theme: Theme
  primary: string
  colorType: 'preset' | 'custom' // 明确标识色彩类型
  presetName?: string // 当使用预设色彩时的预设名称
  isDark: boolean
}

const LAYOUT_STORAGE_KEY = 'layout-config'
const THEME_STORAGE_KEY = 'theme-config'

const defaultLayoutConfig: LayoutConfig = {
  mode: 'sidebar-topbar',
  sidebar: { enabled: true, collapsed: false, overlay: false },
  showBreadcrumb: true,
  animations: true,
  ripple: true,
}
const defaultThemeConfig: ThemeConfig = {
  theme: 'system',
  primary: PRESET_COLORS[0].palette[500], // 默认使用第一个预设色彩
  colorType: 'preset', // 默认使用预设色彩
  presetName: PRESET_COLORS[0].name, // 默认预设名称
  isDark: false,
}

// 自动持久化到 localStorage
const layoutConfig = useStorage<LayoutConfig>(
  LAYOUT_STORAGE_KEY,
  defaultLayoutConfig,
  localStorage,
  { mergeDefaults: true },
)
const themeConfig = useStorage<ThemeConfig>(THEME_STORAGE_KEY, defaultThemeConfig, localStorage, {
  mergeDefaults: true,
})

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

/** 数据迁移：处理旧版本的配置 */
const migrateThemeConfig = () => {
  // 检查是否需要迁移
  if (!themeConfig.value.colorType) {
    // 如果没有 colorType 字段，根据是否有 presetName 来判断
    if (themeConfig.value.presetName) {
      themeConfig.value.colorType = 'preset'
    } else {
      themeConfig.value.colorType = 'custom'
    }
    console.log('主题配置已迁移到新版本格式')
  }
}

/** 应用主题模式 */
const applyTheme = (theme: Theme) => {
  const dark = theme === 'dark' || (theme === 'system' && mediaQuery.matches)
  document.documentElement.classList.toggle(DARK_CLASS, dark)
  themeConfig.value.isDark = dark
}

/** 应用主色 */
const applyColors = () => {
  if (!themeConfig.value.primary) return

  // 根据色彩类型决定使用哪种调色板
  if (themeConfig.value.colorType === 'preset' && themeConfig.value.presetName) {
    // 预设色彩：使用预设的完整调色板
    const preset = PRESET_COLORS.find((p) => p.name === themeConfig.value.presetName)
    if (preset) {
      updatePrimaryPalette(preset.palette)
      return
    }
    // 如果找不到预设，降级为自定义处理
    console.warn(`预设色彩 "${themeConfig.value.presetName}" 未找到，降级为自定义色彩处理`)
    themeConfig.value.colorType = 'custom'
    themeConfig.value.presetName = undefined
  }

  // 自定义色彩：使用生成的调色板
  updatePrimaryPalette(generatePalette(themeConfig.value.primary))
}

/** 设置自定义主色 */
const setPrimaryColor = (color: string) => {
  if (!color.startsWith('#')) color = `#${color}`
  themeConfig.value.primary = color
  themeConfig.value.colorType = 'custom' // 明确标记为自定义色彩
  themeConfig.value.presetName = undefined // 清除预设名称
  updatePrimaryPalette(generatePalette(color))
}

/** 通过预设设置主色 */
const setPresetColor = (presetName: string) => {
  const preset = PRESET_COLORS.find((p) => p.name === presetName)
  if (preset) {
    themeConfig.value.primary = preset.palette[500]
    themeConfig.value.colorType = 'preset' // 明确标记为预设色彩
    themeConfig.value.presetName = presetName // 保存预设名称
    updatePrimaryPalette(preset.palette)
  }
}

/** 初始化 */
const initLayout = () => {
  // 数据迁移
  migrateThemeConfig()

  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    themeConfig.value.theme = mediaQuery.matches ? 'dark' : 'system'
  }
  if (themeConfig.value.theme === 'system') {
    mediaQuery.addEventListener('change', () => applyTheme('system'))
  }
  applyTheme(themeConfig.value.theme)
  applyColors()
}

export function useLayout() {
  return {
    // 状态
    layoutConfig: computed(() => layoutConfig.value),
    themeConfig: computed(() => themeConfig.value),

    // 计算属性
    isDarkMode: computed(() => themeConfig.value.isDark),
    currentTheme: computed(() => themeConfig.value.theme),
    currentPrimary: computed(() => themeConfig.value.primary),
    currentPresetName: computed(() => themeConfig.value.presetName),
    currentColorType: computed(() => themeConfig.value.colorType),
    isCustomColor: computed(() => themeConfig.value.colorType === 'custom'),
    isSidebarCollapsed: computed(() => layoutConfig.value.sidebar.collapsed),

    // 布局模式相关
    currentLayoutMode: computed(() => layoutConfig.value.mode),
    isSidebarTopbarMode: computed(() => layoutConfig.value.mode === 'sidebar-topbar'),
    isTopbarOnlyMode: computed(() => layoutConfig.value.mode === 'topbar-only'),
    showBreadcrumb: computed(() => layoutConfig.value.showBreadcrumb),
    isSidebarEnabled: computed(() => {
      // 仅顶栏模式下禁用侧栏
      if (layoutConfig.value.mode === 'topbar-only') {
        return false
      }
      return layoutConfig.value.sidebar.enabled
    }),

    // 双向绑定颜色
    primaryColor: computed({
      get: () => themeConfig.value.primary,
      set: (v) => setPrimaryColor(v),
    }),

    // 预设色彩
    presetColors: PRESET_COLORS,

    // 方法
    toggleSidebar: () =>
      (layoutConfig.value.sidebar.collapsed = !layoutConfig.value.sidebar.collapsed),
    setTheme: (t: Theme) => applyTheme((themeConfig.value.theme = t)),
    toggleTheme: () =>
      applyTheme((themeConfig.value.theme = themeConfig.value.isDark ? 'light' : 'dark')),
    setPrimary: (c: string) => setPrimaryColor(c),
    setPresetColor,

    // 布局模式方法
    setLayoutMode: (mode: LayoutMode) => {
      layoutConfig.value.mode = mode
      // 切换到仅顶栏模式时，自动调整相关配置
      if (mode === 'topbar-only') {
        layoutConfig.value.sidebar.enabled = false
        layoutConfig.value.showBreadcrumb = false
      } else {
        layoutConfig.value.sidebar.enabled = true
        layoutConfig.value.showBreadcrumb = true
      }
    },
    toggleBreadcrumb: () => {
      layoutConfig.value.showBreadcrumb = !layoutConfig.value.showBreadcrumb
    },

    resetToDefault: () => {
      layoutConfig.value = { ...defaultLayoutConfig }
      themeConfig.value = { ...defaultThemeConfig }
      applyTheme(themeConfig.value.theme)
      applyColors()
    },
    initLayout,
  }
}
