<template>
  <div class="flex flex-col items-center space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-surface-900 dark:text-surface-0 text-lg font-semibold">二次验证</h3>
      <p class="text-surface-600 dark:text-surface-400 mt-2 text-sm">
        请使用手机扫描下方二维码完成验证
      </p>
    </div>

    <!-- 二维码容器 -->
    <div class="relative">
      <div
        class="border-surface-200 dark:border-surface-700 dark:bg-surface-800 flex h-48 w-48 items-center justify-center rounded-lg border-2 bg-white p-4 shadow-lg"
      >
        <img v-if="qrcode" :src="qrcode" alt="二维码" class="h-full w-full" />
        <div v-else class="flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-surface-500 text-2xl"></i>
        </div>
      </div>

      <!-- 倒计时覆盖层 -->
      <div
        v-if="countdown <= 5"
        class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm"
      >
        <div class="text-center text-white">
          <div class="text-2xl font-bold">{{ countdown }}</div>
          <div class="text-sm">秒后过期</div>
        </div>
      </div>
    </div>

    <!-- 倒计时和状态 -->
    <div class="text-center">
      <div class="flex items-center justify-center space-x-2">
        <i class="pi pi-clock text-surface-500"></i>
        <span class="text-surface-600 dark:text-surface-400 text-sm">
          剩余时间: {{ formatTime(countdown) }}
        </span>
      </div>

      <!-- 进度条 -->
      <div class="mt-2 w-48">
        <div class="bg-surface-200 dark:bg-surface-700 h-1 w-full rounded-full">
          <div
            class="bg-primary h-1 rounded-full transition-all duration-1000"
            :style="{ width: `${(countdown / expireSec) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 状态消息 -->
    <div v-if="status" class="text-center">
      <Message :severity="status.type" variant="outlined" class="w-full max-w-sm">
        <div class="flex items-center">
          <i :class="statusIcon" class="mr-2"></i>
          {{ status.message }}
        </div>
      </Message>
    </div>

    <!-- 操作按钮 -->
    <div class="flex space-x-3">
      <Button
        label="刷新二维码"
        icon="pi pi-refresh"
        severity="secondary"
        size="small"
        @click="refreshQRCode"
        :disabled="isRefreshing"
        :loading="isRefreshing"
      />
      <Button
        label="返回登录"
        icon="pi pi-arrow-left"
        severity="secondary"
        size="small"
        outlined
        @click="$emit('back')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCountdown, useIntervalFn } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { computed, ref, watch } from 'vue'

interface Props {
  otpKey: string
}

interface Emits {
  (e: 'back'): void
  (e: 'success', data: any): void
  (e: 'expired'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const userStore = useUserStore()

const isRefreshing = ref(false)
const status = ref<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

const expireSec = 60
const {
  remaining: countdown,
  start,
  stop,
} = useCountdown(expireSec, {
  onComplete() {
    handleExpired()
  },
})

// 二维码
const qrcode = useQRCode(
  computed(() => props.otpKey),
  { width: 180, margin: 2, color: { dark: '#000000', light: '#ffffff' } },
)

const statusIcon = computed(() => {
  switch (status.value?.type) {
    case 'success':
      return 'pi pi-check-circle'
    case 'error':
      return 'pi pi-exclamation-triangle'
    case 'info':
      return 'pi pi-info-circle'
    default:
      return ''
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const { pause: pausePolling, resume: startPolling } = useIntervalFn(
  async () => {
    await checkVerificationStatus()
  },
  1000,
  { immediate: false },
)

async function checkVerificationStatus() {
  try {
    await userStore.verifyOtp(props.otpKey)

    status.value = { type: 'success', message: '验证成功，正在跳转...' }
    stop()
    pausePolling()
    setTimeout(() => emit('success', {}), 1500)
  } catch (err) {
    console.error('检查验证状态失败:', err)
  }
}

function handleExpired() {
  status.value = { type: 'error', message: '二维码已过期，请刷新后重试' }
  stop()
  pausePolling()
  emit('expired')
}

async function refreshQRCode() {
  isRefreshing.value = true
  status.value = null
  try {
    stop()
    pausePolling()
    await new Promise((r) => setTimeout(r, 1000))
    start()
    startPolling()
    status.value = { type: 'info', message: '二维码已刷新' }
    setTimeout(() => (status.value = null), 2000)
  } catch {
    status.value = { type: 'error', message: '刷新失败，请重试' }
  } finally {
    isRefreshing.value = false
  }
}

watch(
  () => props.otpKey,
  (val) => {
    if (val) {
      start()
      startPolling()
    }
  },
  { immediate: true },
)
</script>
