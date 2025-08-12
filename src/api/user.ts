import type { User, UpdateUserParams, ChangePasswordParams, LoginResponse } from '@/types/user'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

// 获取当前用户信息
export const getCurrentUserApi = (): Promise<AxiosResponse<User>> => {
  return axios.get('/user/profile')
}

// 更新用户信息
export const updateUserApi = (params: UpdateUserParams): Promise<AxiosResponse<User>> => {
  return axios.patch('/user/profile', params)
}

// 修改密码
export const changePasswordApi = (params: ChangePasswordParams): Promise<AxiosResponse<void>> => {
  return axios.patch('/user/password', params)
}

// 上传头像
export const uploadAvatarApi = (file: File): Promise<AxiosResponse<{ url: string }>> => {
  const formData = new FormData()
  formData.append('avatar', file)
  return axios.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 登录
export const loginApi = (params: Record<string, any>): Promise<AxiosResponse<LoginResponse>> => {
  return axios.post('/auth/login', params)
}

// 退出登录
export const logoutApi = (): Promise<AxiosResponse<void>> => {
  return axios.post('/auth/logout')
}
