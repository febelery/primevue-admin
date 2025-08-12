import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
  NotificationListResponse,
  NotificationQueryParams,
  NotificationActionParams,
  NotificationStats,
} from '@/types/notification'

// 获取通知列表
export const getNotificationsApi = (
  params?: NotificationQueryParams
): Promise<AxiosResponse<NotificationListResponse>> => {
  return axios.get('/notifications', { params })
}

// 获取通知统计
export const getNotificationStatsApi = (): Promise<AxiosResponse<NotificationStats>> => {
  return axios.get('/notifications/stats')
}

// 标记通知为已读
export const markNotificationsAsReadApi = (
  params: NotificationActionParams
): Promise<AxiosResponse<void>> => {
  return axios.patch('/notifications/read', params)
}

// 标记通知为未读
export const markNotificationsAsUnreadApi = (
  params: NotificationActionParams
): Promise<AxiosResponse<void>> => {
  return axios.patch('/notifications/unread', params)
}

// 归档通知
export const archiveNotificationsApi = (
  params: NotificationActionParams
): Promise<AxiosResponse<void>> => {
  return axios.patch('/notifications/archive', params)
}

// 删除通知
export const deleteNotificationsApi = (
  params: NotificationActionParams
): Promise<AxiosResponse<void>> => {
  return axios.delete('/notifications', { data: params })
}

// 标记所有通知为已读
export const markAllNotificationsAsReadApi = (): Promise<AxiosResponse<void>> => {
  return axios.patch('/notifications/read-all')
}
