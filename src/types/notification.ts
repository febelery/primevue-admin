// 通知类型枚举
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
}

// 通知优先级
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

// 通知状态
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

// 通知数据结构
export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: string
  readAt?: string
  archivedAt?: string
  actionUrl?: string
  actionText?: string
  avatar?: string
  sender?: string
  metadata?: Record<string, any>
}

// 通知列表响应
export interface NotificationListResponse {
  data: Notification[]
  total: number
  unreadCount: number
  page: number
  pageSize: number
}

// 通知查询参数
export interface NotificationQueryParams {
  page?: number
  pageSize?: number
  status?: NotificationStatus
  type?: NotificationType
  priority?: NotificationPriority
  search?: string
  startDate?: string
  endDate?: string
}

// 通知操作参数
export interface NotificationActionParams {
  ids: string[]
  action: 'read' | 'unread' | 'archive' | 'delete'
}

// 通知统计信息
export interface NotificationStats {
  total: number
  unread: number
  read: number
  archived: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
}
