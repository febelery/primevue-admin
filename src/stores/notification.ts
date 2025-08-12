import {
  getNotificationsApi,
  markNotificationsAsReadApi,
  markNotificationsAsUnreadApi,
  archiveNotificationsApi,
  deleteNotificationsApi,
  markAllNotificationsAsReadApi,
} from '@/api/notifications'
import type { Notification, NotificationQueryParams, NotificationStats } from '@/types/notification'
import { NotificationStatus, NotificationType, NotificationPriority } from '@/types/notification'
import { useQuery, useMutation } from '@pinia/colada'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // ----------------
  // State
  // ----------------
  const queryParams = ref<NotificationQueryParams>({
    page: 1,
    pageSize: 20,
  })

  // ----------------
  // Query
  // ----------------
  const notificationQuery = useQuery({
    key: () => ['notifications', queryParams.value],
    query: async () => {
      const response = await getNotificationsApi(queryParams.value)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2分钟
  })

  // ----------------
  // Getters (computed)
  // ----------------
  const notifications = computed<Notification[]>(() => notificationQuery.data.value?.data || [])

  const total = computed(() => notificationQuery.data.value?.total || 0)
  const currentPage = computed(() => notificationQuery.data.value?.page || 1)
  const pageSize = computed(() => notificationQuery.data.value?.pageSize || 20)
  const loading = computed(() => notificationQuery.isLoading.value)
  const error = computed(() => notificationQuery.error.value)

  const unreadCount = computed(
    () => notifications.value.filter((n) => n.status === NotificationStatus.UNREAD).length,
  )
  const readCount = computed(
    () => notifications.value.filter((n) => n.status === NotificationStatus.READ).length,
  )
  const archivedCount = computed(
    () => notifications.value.filter((n) => n.status === NotificationStatus.ARCHIVED).length,
  )

  const stats = computed<NotificationStats>(() => {
    const byType = {} as Record<NotificationType, number>
    const byPriority = {} as Record<NotificationPriority, number>

    Object.values(NotificationType).forEach((type) => (byType[type] = 0))
    Object.values(NotificationPriority).forEach((priority) => (byPriority[priority] = 0))

    notifications.value.forEach((notification) => {
      byType[notification.type]++
      byPriority[notification.priority]++
    })

    return {
      total: notifications.value.length,
      unread: unreadCount.value,
      read: readCount.value,
      archived: archivedCount.value,
      byType,
      byPriority,
    }
  })

  // ----------------
  // Actions（封装成 async 方法）
  // ----------------
  function fetchNotifications(params?: NotificationQueryParams) {
    if (params) {
      queryParams.value = { ...queryParams.value, ...params }
    }
    return notificationQuery.refetch()
  }

  const _markAsReadMutation = useMutation({
    mutation: async (ids: string[]) => {
      await markNotificationsAsReadApi({ ids, action: 'read' })
    },
    onSuccess: () => notificationQuery.refetch(),
  })
  const markAsRead = async (ids: string[]) => {
    await _markAsReadMutation.mutateAsync(ids)
  }

  const _markAsUnreadMutation = useMutation({
    mutation: async (ids: string[]) => {
      await markNotificationsAsUnreadApi({ ids, action: 'unread' })
    },
    onSuccess: () => notificationQuery.refetch(),
  })
  const markAsUnread = async (ids: string[]) => {
    await _markAsUnreadMutation.mutateAsync(ids)
  }

  const _archiveNotificationsMutation = useMutation({
    mutation: async (ids: string[]) => {
      await archiveNotificationsApi({ ids, action: 'archive' })
    },
    onSuccess: () => notificationQuery.refetch(),
  })
  const archiveNotifications = async (ids: string[]) => {
    await _archiveNotificationsMutation.mutateAsync(ids)
  }

  const _deleteNotificationsMutation = useMutation({
    mutation: async (ids: string[]) => {
      await deleteNotificationsApi({ ids, action: 'delete' })
    },
    onSuccess: () => notificationQuery.refetch(),
  })
  const deleteNotifications = async (ids: string[]) => {
    await _deleteNotificationsMutation.mutateAsync(ids)
  }

  const _markAllAsReadMutation = useMutation({
    mutation: async () => {
      await markAllNotificationsAsReadApi()
    },
    onSuccess: () => notificationQuery.refetch(),
  })
  const markAllAsRead = async () => {
    await _markAllAsReadMutation.mutateAsync()
  }

  // ----------------
  // 返回给外部使用
  // ----------------
  return {
    // state
    queryParams,

    // query
    notificationQuery,
    notifications,
    total,
    currentPage,
    pageSize,
    loading,
    error,
    unreadCount,
    readCount,
    archivedCount,
    stats,

    // actions
    fetchNotifications,
    markAsRead,
    markAsUnread,
    archiveNotifications,
    deleteNotifications,
    markAllAsRead,
  }
})
