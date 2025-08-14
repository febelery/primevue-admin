<template>
  <div class="user-menu-container">
    <!-- 用户信息触发器 -->
    <div
      class="user-trigger"
      :class="[
        'group flex cursor-pointer items-center rounded-xl p-3 transition-all duration-200',
        'hover:bg-surface-100/80 dark:hover:bg-surface-800/80 hover:shadow-md',
        layout === 'horizontal'
          ? 'space-x-3'
          : collapsed
            ? 'justify-center space-x-0'
            : 'space-x-3',
      ]"
      @click="toggleUserMenu"
    >
      <!-- 用户头像 -->
      <div class="relative flex-shrink-0">
        <Avatar
          :image="userStore.userAvatar"
          :label="userStore.userName.charAt(0).toUpperCase()"
          :size="avatarSize"
          shape="circle"
          :class="[
            'ring-primary/20 group-hover:ring-primary/40 ring-2 transition-all duration-200',
            userStore.userAvatar ? '' : 'bg-primary text-primary-contrast',
          ]"
        />
        <!-- 在线状态指示器 -->
        <div
          v-if="showOnlineStatus"
          class="border-surface-0 dark:border-surface-900 absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-500"
        ></div>
      </div>

      <!-- 用户信息 -->
      <div
        v-if="showUserInfo"
        class="flex-1"
        :class="layout === 'vertical' ? 'text-center' : ''"
        style="min-width: 0"
      >
        <p
          class="text-surface-900 dark:text-surface-0 group-hover:text-primary truncate text-sm font-semibold transition-colors"
        >
          {{ userStore.userName }}
        </p>
        <p v-if="showEmail" class="text-surface-500 dark:text-surface-400 truncate text-xs">
          {{ userStore.user?.email }}
        </p>
      </div>

      <!-- 展开图标 -->
      <i
        v-if="showExpandIcon"
        :class="[
          'pi text-surface-400 group-hover:text-primary text-xs transition-all duration-200',
          layout === 'horizontal' ? 'pi-chevron-down' : 'pi-chevron-up',
        ]"
      ></i>
    </div>

    <!-- 用户菜单弹出层 -->
    <Popover ref="userMenuRef" :pt="popoverPt">
      <div :class="['user-menu-content', `w-${menuWidth}`]">
        <!-- 菜单头部 -->
        <div
          v-if="showMenuHeader"
          class="border-surface-200/50 dark:border-surface-700/50 border-b px-4 py-3"
        >
          <div class="flex items-center space-x-3">
            <Avatar
              :image="userStore.userAvatar"
              :label="userStore.userName.charAt(0).toUpperCase()"
              size="large"
              shape="circle"
              :class="userStore.userAvatar ? '' : 'bg-primary text-primary-contrast'"
            />
            <div class="flex-1" style="min-width: 0">
              <p class="text-surface-900 dark:text-surface-0 truncate text-sm font-semibold">
                {{ userStore.userName }}
              </p>
              <p class="text-surface-500 dark:text-surface-400 truncate text-xs">
                {{ userStore.user?.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- 菜单项列表 -->
        <div class="py-2">
          <template v-for="item in menuItems" :key="item.key">
            <Divider v-if="item.separator" class="my-2" />
            <a
              v-else
              href="#"
              :class="[
                'group hover:bg-surface-50 dark:hover:bg-surface-800 mx-2 flex items-center rounded-lg px-4 py-3 text-sm transition-all duration-200',
                item.action === 'logout'
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                  : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100',
              ]"
              @click.prevent="handleMenuItemClick(item)"
            >
              <i
                :class="[
                  item.icon,
                  'mr-3 text-base transition-transform duration-200 group-hover:scale-110',
                  item.action === 'logout' ? 'text-red-500' : 'text-surface-500',
                ]"
              ></i>
              <span class="flex-1 font-medium">{{ item.label }}</span>
              <i
                class="pi pi-chevron-right ml-auto text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              ></i>
            </a>
          </template>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { getUserMenuItems } from '@/config/userMenu'
import { useUserStore } from '@/stores/user'
import type { UserMenuItem } from '@/types/user'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Props 定义
interface Props {
  /** 布局模式：水平或垂直 */
  layout?: 'horizontal' | 'vertical'
  /** 是否折叠状态（影响用户信息显示） */
  collapsed?: boolean
  /** 头像大小 */
  avatarSize?: 'small' | 'normal' | 'large'
  /** 是否显示用户信息 */
  showUserInfo?: boolean
  /** 是否显示邮箱 */
  showEmail?: boolean
  /** 是否显示在线状态 */
  showOnlineStatus?: boolean
  /** 是否显示展开图标 */
  showExpandIcon?: boolean
  /** 是否显示菜单头部 */
  showMenuHeader?: boolean
  /** 菜单宽度（Tailwind 数值，如 64） */
  menuWidth?: number
  /** 自定义菜单项 */
  customMenuItems?: UserMenuItem[]
}

// Emits 定义
interface Emits {
  /** 菜单项点击事件 */
  (e: 'menu-item-click', item: UserMenuItem): void
  /** 用户菜单切换事件 */
  (e: 'menu-toggle', visible: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  collapsed: false,
  avatarSize: 'normal',
  showUserInfo: true,
  showEmail: true,
  showOnlineStatus: true,
  showExpandIcon: true,
  showMenuHeader: true,
  menuWidth: 64,
})

const emit = defineEmits<Emits>()

// 组合式 API
const userStore = useUserStore()
const router = useRouter()
const userMenuRef = ref()

// 计算属性
const showUserInfo = computed(() => {
  return props.showUserInfo && !props.collapsed
})

const showExpandIcon = computed(() => {
  return props.showExpandIcon && !props.collapsed
})

const menuItems = computed(() => {
  if (props.customMenuItems) {
    return props.customMenuItems
  }
  return getUserMenuItems(userStore.user?.role)
})

const popoverPt = computed(() => ({
  root: { class: 'shadow-2xl border-0' },
  content: { class: 'rounded-xl overflow-hidden p-0 border-0' },
}))

// 方法
const toggleUserMenu = (event: Event) => {
  const isVisible = userMenuRef.value?.visible
  userMenuRef.value?.toggle(event)
  emit('menu-toggle', !isVisible)
}

const handleMenuItemClick = async (item: UserMenuItem) => {
  userMenuRef.value?.hide() // 关闭菜单

  // 发出事件，让父组件处理
  emit('menu-item-click', item)

  // 默认处理逻辑
  if (item.action === 'logout') {
    await userStore.logout()
  } else if (item.route) {
    router.push(item.route)
  }
}

// 暴露方法给父组件
defineExpose({
  toggleMenu: toggleUserMenu,
  hideMenu: () => userMenuRef.value?.hide(),
  showMenu: (event: Event) => userMenuRef.value?.show(event),
})
</script>
