import type { UserMenuItem } from '@/types/user'

/**
 * 用户菜单配置
 * 从 userStore 中提取出来，保持 store 的纯粹性
 */
export const defaultUserMenuItems: UserMenuItem[] = [
  {
    key: 'profile',
    label: '个人资料',
    icon: 'pi pi-user',
    route: '/profile',
  },
  {
    key: 'settings',
    label: '账户设置',
    icon: 'pi pi-cog',
    route: '/settings',
  },
  {
    key: 'preferences',
    label: '偏好设置',
    icon: 'pi pi-sliders-h',
    route: '/preferences',
  },
  {
    key: 'help',
    label: '帮助中心',
    icon: 'pi pi-question-circle',
    route: '/help',
  },
  {
    key: 'feedback',
    label: '意见反馈',
    icon: 'pi pi-comment',
    route: '/feedback',
  },
  {
    key: 'separator2',
    separator: true,
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: 'pi pi-sign-out',
    action: 'logout',
  },
]

/**
 * 根据用户角色获取菜单项
 * 可以根据不同角色显示不同的菜单项
 */
export function getUserMenuItems(userRole?: string): UserMenuItem[] {
  // 基础菜单项
  let menuItems = [...defaultUserMenuItems]

  // 根据角色过滤或添加菜单项
  if (userRole === 'admin') {
    // 管理员可以看到额外的菜单项
    const adminItems: UserMenuItem[] = [
      {
        key: 'admin-panel',
        label: '管理面板',
        icon: 'pi pi-shield',
        route: '/admin',
      },
      {
        key: 'separator-admin',
        separator: true,
      },
    ]
    
    // 在帮助中心之前插入管理员菜单
    const helpIndex = menuItems.findIndex(item => item.key === 'help')
    menuItems.splice(helpIndex, 0, ...adminItems)
  }

  return menuItems.filter(item => item.visible !== false)
}
