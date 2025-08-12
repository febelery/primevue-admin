// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

// 用户信息接口
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: UserRole
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  preferences?: UserPreferences
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisible: boolean
    emailVisible: boolean
  }
}

// 用户菜单项
export interface UserMenuItem {
  key: string
  label?: string
  icon?: string
  route?: string
  action?: string
  separator?: boolean
  visible?: boolean
}

// 用户登录响应
export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

// 用户更新参数
export interface UpdateUserParams {
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  preferences?: Partial<UserPreferences>
}

// 修改密码参数
export interface ChangePasswordParams {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
