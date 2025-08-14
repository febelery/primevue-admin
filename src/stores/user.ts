import { getCurrentUserApi, updateUserApi, logoutApi, loginApi } from '@/api/user'
import type { UpdateUserParams, User } from '@/types/user'
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

    // 清除错误
    clearError() {
      this.error = null
    },
  },
})
