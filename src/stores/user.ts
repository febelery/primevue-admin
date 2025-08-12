import { getCurrentUserApi, updateUserApi, logoutApi, loginApi } from '@/api/user'
import type { UserMenuItem, UpdateUserParams, User } from '@/types/user'
import { UserRole } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as Error | null,
  }),

  getters: {
    // 计算属性
    isLoggedIn(): boolean {
      return !!this.user
    },

    isAdmin(): boolean {
      return this.user?.role === UserRole.ADMIN
    },

    userName(): string {
      return this.user?.fullName || this.user?.username || ''
    },

    userAvatar(): string | undefined {
      return this.user?.avatar
    },

    // 用户菜单项
    userMenuItems(): UserMenuItem[] {
      return [
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
    },
  },

  actions: {
    // 获取用户数据
    async fetchCurrentUser() {
      this.loading = true
      this.error = null

      try {
        const response = await getCurrentUserApi()
        this.user = response.data
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('获取用户信息失败')
        this.user = null
      } finally {
        this.loading = false
      }
    },

    // 更新用户信息
    async updateUser(params: UpdateUserParams) {
      this.loading = true
      this.error = null

      try {
        const response = await updateUserApi(params)
        this.user = response.data
        return response.data
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('更新用户信息失败')
        throw err
      } finally {
        this.loading = false
      }
    },

    // 登录
    async login(credentials: Record<string, any>) {
      this.loading = true
      this.error = null

      try {
        const response = await loginApi(credentials)
        // 登录成功后获取用户信息
        await this.fetchCurrentUser()
        return response.data
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('登录失败')
        throw err
      } finally {
        this.loading = false
      }
    },

    // 退出登录
    async logout() {
      this.loading = true
      this.error = null

      try {
        await logoutApi()
        this.user = null
        // 清除本地存储的token等
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        // 重定向到登录页
        window.location.href = '/login'
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('退出登录失败')
      } finally {
        this.loading = false
      }
    },

    // 处理用户菜单点击
    async handleUserMenuClick(item: UserMenuItem) {
      if (item.action === 'logout') {
        await this.logout()
      } else if (item.route) {
        console.log('导航到:', item.route)
      }
    },

    // 清除错误
    clearError() {
      this.error = null
    },
  },
})
