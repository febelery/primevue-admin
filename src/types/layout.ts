// 菜单项类型定义
export interface MenuItem {
  key: string
  label: string
  icon?: string
  route?: string
  badge?: string | number
  badgeClass?: string
  children?: MenuItem[]
  separator?: boolean
  visible?: boolean
  order?: number
}

// 布局配置类型
export interface LayoutConfig {
  sidebar: {
    enabled: boolean
    resizable: boolean
    defaultWidth: number
    minWidth: number
    maxWidth: number
  }
}
