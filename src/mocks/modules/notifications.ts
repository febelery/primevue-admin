import { buildMockApiUrl } from '@/lib/utils'
import type {
  Notification,
  NotificationListResponse,
  NotificationQueryParams,
  NotificationActionParams,
  NotificationStats,
} from '@/types/notification'
import { NotificationType, NotificationPriority, NotificationStatus } from '@/types/notification'
import { http, HttpResponse } from 'msw'

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '系统更新通知',
    message: '系统将在今晚 23:00 进行维护更新，预计耗时 2 小时',
    type: NotificationType.SYSTEM,
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    sender: '系统管理员',
    avatar: 'pi pi-cog',
  },
  {
    id: '2',
    title: '新消息',
    message: '您有一条来自张三的新消息',
    type: NotificationType.INFO,
    priority: NotificationPriority.NORMAL,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
    sender: '张三',
    actionUrl: '/messages/123',
    actionText: '查看消息',
  },
  {
    id: '3',
    title: '任务完成',
    message: '您的数据导出任务已完成',
    type: NotificationType.SUCCESS,
    priority: NotificationPriority.NORMAL,
    status: NotificationStatus.READ,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
    readAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actionUrl: '/downloads/export-123',
    actionText: '下载文件',
  },
  {
    id: '4',
    title: '警告',
    message: '检测到异常登录行为，请检查您的账户安全',
    type: NotificationType.WARNING,
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3小时前
    sender: '安全中心',
    actionUrl: '/security/logs',
    actionText: '查看详情',
  },
  {
    id: '5',
    title: '错误报告',
    message: '数据同步失败，请联系技术支持',
    type: NotificationType.ERROR,
    priority: NotificationPriority.URGENT,
    status: NotificationStatus.UNREAD,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6小时前
    sender: '系统监控',
    actionUrl: '/support/ticket/456',
    actionText: '提交工单',
  },
]

// 过滤通知的辅助函数
function filterNotifications(notifications: Notification[], params?: NotificationQueryParams) {
  let filtered = [...notifications]

  if (params?.status) {
    filtered = filtered.filter((n) => n.status === params.status)
  }

  if (params?.type) {
    filtered = filtered.filter((n) => n.type === params.type)
  }

  if (params?.priority) {
    filtered = filtered.filter((n) => n.priority === params.priority)
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase()
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower),
    )
  }

  return filtered
}

// 计算统计信息
function calculateStats(notifications: Notification[]): NotificationStats {
  const byType = {} as Record<NotificationType, number>
  const byPriority = {} as Record<NotificationPriority, number>

  // 初始化计数器
  Object.values(NotificationType).forEach((type) => {
    byType[type] = 0
  })
  Object.values(NotificationPriority).forEach((priority) => {
    byPriority[priority] = 0
  })

  // 统计
  notifications.forEach((notification) => {
    byType[notification.type]++
    byPriority[notification.priority]++
  })

  return {
    total: notifications.length,
    unread: notifications.filter((n) => n.status === NotificationStatus.UNREAD).length,
    read: notifications.filter((n) => n.status === NotificationStatus.READ).length,
    archived: notifications.filter((n) => n.status === NotificationStatus.ARCHIVED).length,
    byType,
    byPriority,
  }
}

export default [
  // 获取通知列表
  http.get(buildMockApiUrl('/notifications'), ({ request }) => {
    const url = new URL(request.url)
    const params: NotificationQueryParams = {
      page: Number(url.searchParams.get('page')) || 1,
      pageSize: Number(url.searchParams.get('pageSize')) || 20,
      status: url.searchParams.get('status') as any,
      type: url.searchParams.get('type') as any,
      priority: url.searchParams.get('priority') as any,
      search: url.searchParams.get('search') || undefined,
    }

    const filtered = filterNotifications(mockNotifications, params)
    const start = (params.page! - 1) * params.pageSize!
    const end = start + params.pageSize!
    const paginatedData = filtered.slice(start, end)

    const response: NotificationListResponse = {
      data: paginatedData,
      total: filtered.length,
      unreadCount: mockNotifications.filter((n) => n.status === NotificationStatus.UNREAD).length,
      page: params.page!,
      pageSize: params.pageSize!,
    }

    return HttpResponse.json(response)
  }),

  // 获取通知统计
  http.get(buildMockApiUrl('/notifications/stats'), () => {
    const stats = calculateStats(mockNotifications)
    return HttpResponse.json(stats)
  }),

  // 标记为已读
  http.patch(buildMockApiUrl('/notifications/read'), async ({ request }) => {
    const params = (await request.json()) as NotificationActionParams

    mockNotifications.forEach((notification) => {
      if (
        params.ids.includes(notification.id) &&
        notification.status === NotificationStatus.UNREAD
      ) {
        notification.status = NotificationStatus.READ
        notification.readAt = new Date().toISOString()
      }
    })

    return HttpResponse.json(null, { status: 200 })
  }),

  // 标记为未读
  http.patch(buildMockApiUrl('/notifications/unread'), async ({ request }) => {
    const params = (await request.json()) as NotificationActionParams

    mockNotifications.forEach((notification) => {
      if (params.ids.includes(notification.id) && notification.status === NotificationStatus.READ) {
        notification.status = NotificationStatus.UNREAD
        notification.readAt = undefined
      }
    })

    return HttpResponse.json(null, { status: 200 })
  }),

  // 归档通知
  http.patch(buildMockApiUrl('/notifications/archive'), async ({ request }) => {
    const params = (await request.json()) as NotificationActionParams

    mockNotifications.forEach((notification) => {
      if (params.ids.includes(notification.id)) {
        notification.status = NotificationStatus.ARCHIVED
        notification.archivedAt = new Date().toISOString()
      }
    })

    return HttpResponse.json(null, { status: 200 })
  }),

  // 删除通知
  http.delete(buildMockApiUrl('/notifications'), async ({ request }) => {
    const params = (await request.json()) as NotificationActionParams

    for (let i = mockNotifications.length - 1; i >= 0; i--) {
      if (params.ids.includes(mockNotifications[i].id)) {
        mockNotifications.splice(i, 1)
      }
    }

    return HttpResponse.json(null, { status: 200 })
  }),

  // 标记所有为已读
  http.patch(buildMockApiUrl('/notifications/read-all'), () => {
    mockNotifications.forEach((notification) => {
      if (notification.status === NotificationStatus.UNREAD) {
        notification.status = NotificationStatus.READ
        notification.readAt = new Date().toISOString()
      }
    })

    return HttpResponse.json(null, { status: 200 })
  }),
]
