import { getCurrentUserApi, loginApi, verifyOtpApi } from '@/api/users'
import { getFingerprint } from '@/lib/utils'
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  name: string
  username: string
  email: string
  role: string
  status: string
  avatar?: string
  permissions: string[]
}

interface StoredUser {
  token: string
  expiresAt: number
  userInfo: UserInfo
}

interface UserState {
  token: string | null
  expiresAt: number | null
  userInfo: UserInfo | null
}

const STORAGE_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'user_token'

function loadStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveStoredUser(user: StoredUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const stored = loadStoredUser()
    return {
      token: stored?.token ?? null,
      expiresAt: stored?.expiresAt ?? null,
      userInfo: stored?.userInfo ?? null,
    }
  },

  getters: {
    isLoggedIn: (state): boolean => {
      return !!state.token && !!state.expiresAt && Date.now() / 1000 < state.expiresAt
    },
  },

  actions: {
    async login(credentials: Record<string, any>) {
      try {
        const fingerprint = await getFingerprint()
        const res = await loginApi({ ...credentials, fingerprint } as any)

        const data = res.data

        if (res.status === 202 || data?.need_otp) {
          return { needOtp: true, otpKey: data.otp_key }
        }

        this.setSession(data)
        return { needOtp: false }
      } catch (err) {
        this.reset()
        throw err
      }
    },

    async verifyOtp(otpKey: string) {
      try {
        const res = await verifyOtpApi({ otp_key: otpKey })
        this.setSession(res.data)
      } catch (err) {
        this.reset()
        throw err
      }
    },

    async getUserInfo(): Promise<UserInfo | null> {
      if (!this.isLoggedIn) {
        this.reset()
        return null
      }

      try {
        const res = await getCurrentUserApi()
        this.userInfo = res.data
        this.saveToStorage()
        return this.userInfo
      } catch (err) {
        this.reset()
        console.error(err)
        return null
      }
    },

    getToken(): string | null {
      if (!this.isLoggedIn) {
        this.reset()
        return null
      }
      return this.token
    },

    saveToStorage() {
      if (this.token && this.expiresAt && this.userInfo) {
        saveStoredUser({
          token: this.token,
          expiresAt: this.expiresAt,
          userInfo: this.userInfo,
        })
      }
    },

    setSession(data: { token: string; expire_at: number; user: UserInfo }) {
      this.token = data.token
      this.expiresAt = data.expire_at
      this.userInfo = data.user
      this.saveToStorage()
    },

    reset() {
      this.token = null
      this.expiresAt = null
      this.userInfo = null
      clearStoredUser()
    },

    logout() {
      this.reset()
    },
  },
})
