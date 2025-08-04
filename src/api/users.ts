import axios from 'axios'
import type { AxiosResponse } from 'axios'

export interface User {
  id: number
  name: string
  username: string
  email: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
  avatar?: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  status?: string
}

export interface UserListResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserParams {
  name: string
  username: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
}

export interface UpdateUserParams extends Partial<Omit<CreateUserParams, 'password'>> {
  id: number
  password?: string
}

export interface LoginParams {
  username: string
  password: string
  fingerprint?: string
}

export interface LoginResponse {
  token: string
  expire_at: number
  user: User
  need_otp?: boolean
  otp_key?: string
}

export interface VerifyOtpParams {
  otp_key: string
}

// 用户登录
export const loginApi = (params: LoginParams): Promise<AxiosResponse<LoginResponse>> => {
  return axios.post('/auth/login', params)
}

// OTP验证
export const verifyOtpApi = (params: VerifyOtpParams): Promise<AxiosResponse<LoginResponse>> => {
  return axios.post('/auth/otp', params)
}

// 获取当前用户信息
export const getCurrentUserApi = (): Promise<AxiosResponse<User>> => {
  return axios.get('/auth/me')
}
