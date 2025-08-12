<template>
  <!-- 通知面板 -->
  <div
    class="notification-panel bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-lg border shadow-xl"
  >
    <!-- 面板头部 -->
    <div
      class="border-surface-200 dark:border-surface-700 flex items-center justify-between border-b px-4 py-3"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-bell text-primary text-lg"></i>
        <h3 class="text-surface-900 dark:text-surface-100 text-base font-semibold">通知中心</h3>
        <span
          v-if="notificationStore.unreadCount > 0"
          class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </div>
      <div class="flex items-center space-x-1">
        <Button
          icon="pi pi-check"
          severity="secondary"
          text
          rounded
          size="small"
          @click="markAllAsRead"
          v-tooltip.left="'全部已读'"
          :disabled="notificationStore.unreadCount === 0"
        />
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          @click="$emit('close')"
          v-tooltip.left="'关闭'"
        />
      </div>
    </div>

    <!-- 过滤标签 -->
    <div class="border-surface-200 dark:border-surface-700 border-b px-4 py-2">
      <div class="flex space-x-1">
        <Button
          :label="`全部 (${notificationStore.total})`"
          :severity="activeFilter === 'all' ? 'primary' : 'secondary'"
          :outlined="activeFilter !== 'all'"
          size="small"
          @click="setFilter('all')"
        />
        <Button
          :label="`未读 (${notificationStore.unreadCount})`"
          :severity="activeFilter === 'unread' ? 'primary' : 'secondary'"
          :outlined="activeFilter !== 'unread'"
          size="small"
          @click="setFilter('unread')"
        />
        <Button
          :label="`已读 (${notificationStore.readCount})`"
          :severity="activeFilter === 'read' ? 'primary' : 'secondary'"
          :outlined="activeFilter !== 'read'"
          size="small"
          @click="setFilter('read')"
        />
      </div>
    </div>

    <!-- 通知列表 -->
    <div class="max-h-[60vh] overflow-y-auto">
      <!-- 加载状态 -->
      <div v-if="notificationStore.loading" class="flex items-center justify-center p-8">
        <i class="pi pi-spin pi-spinner text-surface-500 text-2xl"></i>
      </div>

      <!-- 空状态 -->
      <div
        v-else-if="notificationStore.notifications.length === 0"
        class="flex flex-col items-center justify-center p-8 text-center"
      >
        <i class="pi pi-bell-slash text-surface-400 mb-3 text-3xl"></i>
        <p class="text-surface-500 dark:text-surface-400 text-sm">暂无通知</p>
      </div>

      <!-- 通知项列表 -->
      <div v-else class="divide-surface-200 dark:divide-surface-700 divide-y">
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :class="[
            'group hover:bg-surface-50 dark:hover:bg-surface-800 relative cursor-pointer px-4 py-3 transition-colors',
            {
              'bg-primary-50 dark:bg-primary-900/20': notification.status === 'unread',
            },
          ]"
          @click="handleNotificationClick(notification)"
        >
          <!-- 未读指示器 -->
          <div
            v-if="notification.status === 'unread'"
            class="bg-primary-500 absolute top-1/2 left-2 h-2 w-2 -translate-y-1/2 rounded-full"
          ></div>

          <div class="flex items-start space-x-3">
            <!-- 图标/头像 -->
            <div class="flex-shrink-0">
              <div
                v-if="notification.avatar && notification.avatar.startsWith('pi')"
                :class="[
                  notification.avatar,
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                  getNotificationIconClass(notification.type),
                ]"
              ></div>
              <Avatar
                v-else-if="notification.avatar"
                :image="notification.avatar"
                size="small"
                shape="circle"
              />
              <div
                v-else
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                  getNotificationIconClass(notification.type),
                ]"
              >
                <i :class="getNotificationIcon(notification.type)"></i>
              </div>
            </div>

            <!-- 内容 -->
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1">
                  <p
                    :class="[
                      'text-sm',
                      notification.status === 'unread'
                        ? 'text-surface-900 dark:text-surface-100 font-medium'
                        : 'text-surface-700 dark:text-surface-300',
                    ]"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="text-surface-500 dark:text-surface-400 mt-1 text-xs">
                    {{ notification.message }}
                  </p>
                  <div class="mt-2 flex items-center space-x-2 text-xs">
                    <span class="text-surface-400 dark:text-surface-500">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                    <span v-if="notification.sender" class="text-surface-400 dark:text-surface-500">
                      · {{ notification.sender }}
                    </span>
                    <span
                      :class="[
                        'rounded px-1.5 py-0.5 text-xs font-medium',
                        getPriorityClass(notification.priority),
                      ]"
                    >
                      {{ getPriorityLabel(notification.priority) }}
                    </span>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div
                  class="ml-2 flex flex-shrink-0 space-x-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Button
                    v-if="notification.status === 'unread'"
                    icon="pi pi-check"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    @click.stop="markAsRead([notification.id])"
                    v-tooltip.left="'标记已读'"
                  />
                  <Button
                    v-else
                    icon="pi pi-undo"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    @click.stop="markAsUnread([notification.id])"
                    v-tooltip.left="'标记未读'"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    @click.stop="deleteNotification(notification.id)"
                    v-tooltip.left="'删除'"
                  />
                </div>
              </div>

              <!-- 操作按钮 -->
              <div v-if="notification.actionUrl && notification.actionText" class="mt-2">
                <Button
                  :label="notification.actionText"
                  severity="primary"
                  outlined
                  size="small"
                  @click.stop="handleAction(notification)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div
      v-if="notificationStore.notifications.length > 0"
      class="border-surface-200 dark:border-surface-700 border-t px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <span class="text-surface-500 dark:text-surface-400 text-xs">
          共 {{ notificationStore.total }} 条通知
        </span>
        <Button label="查看全部" severity="secondary" text size="small" @click="viewAll" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { NotificationStatus, NotificationType, NotificationPriority } from '@/types/notification'
import type { Notification } from '@/types/notification'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 定义事件
defineEmits<{
  close: []
}>()

const router = useRouter()
const notificationStore = useNotificationStore()

// 状态
const activeFilter = ref<'all' | 'unread' | 'read'>('all')

// 方法
const setFilter = async (filter: 'all' | 'unread' | 'read') => {
  activeFilter.value = filter

  const params = filter === 'all' ? {} : { status: filter as NotificationStatus }
  await notificationStore.fetchNotifications(params)
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const markAsRead = async (ids: string[]) => {
  await notificationStore.markAsRead(ids)
}

const markAsUnread = async (ids: string[]) => {
  await notificationStore.markAsUnread(ids)
}

const deleteNotification = async (id: string) => {
  await notificationStore.deleteNotifications([id])
}

const handleNotificationClick = async (notification: Notification) => {
  // 如果未读，标记为已读
  if (notification.status === NotificationStatus.UNREAD) {
    await markAsRead([notification.id])
  }

  // 如果有操作链接，跳转
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

const handleAction = (notification: Notification) => {
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

const viewAll = () => {
  router.push('/notifications')
}

// 工具函数
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString('zh-CN')
}

const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    [NotificationType.INFO]: 'pi pi-info-circle',
    [NotificationType.SUCCESS]: 'pi pi-check-circle',
    [NotificationType.WARNING]: 'pi pi-exclamation-triangle',
    [NotificationType.ERROR]: 'pi pi-times-circle',
    [NotificationType.SYSTEM]: 'pi pi-cog',
  }
  return icons[type]
}

const getNotificationIconClass = (type: NotificationType) => {
  const classes = {
    [NotificationType.INFO]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    [NotificationType.SUCCESS]:
      'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    [NotificationType.WARNING]:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    [NotificationType.ERROR]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    [NotificationType.SYSTEM]: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
  }
  return classes[type]
}

const getPriorityLabel = (priority: NotificationPriority) => {
  const labels = {
    [NotificationPriority.LOW]: '低',
    [NotificationPriority.NORMAL]: '普通',
    [NotificationPriority.HIGH]: '高',
    [NotificationPriority.URGENT]: '紧急',
  }
  return labels[priority]
}

const getPriorityClass = (priority: NotificationPriority) => {
  const classes = {
    [NotificationPriority.LOW]: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    [NotificationPriority.NORMAL]:
      'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    [NotificationPriority.HIGH]:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    [NotificationPriority.URGENT]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
  return classes[priority]
}

// 监听过滤器变化
watch(activeFilter, () => {
  // 过滤器变化时的逻辑已在 setFilter 中处理
})

// 初始化
onMounted(async () => {
  await notificationStore.fetchNotifications()
})
</script>

<style scoped>
.notification-panel {
  width: 400px;
  max-width: 90vw;
}

@media (max-width: 640px) {
  .notification-panel {
    width: 350px;
  }
}
</style>
