<template>
  <div
    class="from-surface-50 via-primary-50 to-surface-100 dark:from-surface-950 dark:via-primary-950 dark:to-surface-900 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br select-none"
  >
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 浮动圆圈 -->
      <div
        class="bg-primary-200/30 dark:bg-primary-800/30 animate-float absolute top-20 left-20 h-32 w-32 rounded-full"
      ></div>

      <!-- 几何图形 -->
      <div
        class="border-primary-300/40 dark:border-primary-600/40 animate-float absolute top-16 right-1/4 h-20 w-20 rotate-45 border-4"
      ></div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
      <!-- 错误代码 -->
      <div class="mb-8">
        <h1
          class="from-primary-500 via-primary-600 to-secondary-500 dark:from-primary-400 dark:via-primary-300 dark:to-secondary-400 bg-gradient-to-r bg-clip-text text-9xl font-black text-transparent md:text-[12rem]"
        >
          401
        </h1>
        <div
          class="from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 mx-auto h-2 w-32 rounded-full bg-gradient-to-r"
        ></div>
      </div>

      <!-- 插图 -->
      <div class="relative mb-8">
        <div class="relative mx-auto w-64 lg:w-128">
          <!-- 发光效果背景 -->
          <div
            class="from-primary-200/50 via-secondary-200/50 to-primary-200/50 dark:from-primary-800/50 dark:via-secondary-800/50 dark:to-primary-800/50 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r blur-3xl"
          ></div>
          <!-- SVG图片 -->
          <img
            src="@/assets/images/401_error_unauthorized.svg"
            draggable="false"
            class="animate-float relative z-10 h-full w-full"
          />
        </div>
      </div>

      <!-- 文字内容 -->
      <div class="mb-12 space-y-4">
        <h2 class="text-surface-800 dark:text-surface-100 mb-4 text-3xl font-bold md:text-4xl">
          禁止访问
        </h2>
        <p
          class="text-surface-600 dark:text-surface-300 mx-auto max-w-2xl text-lg leading-relaxed md:text-xl"
        >
          你无权访问此页面，请检查权限或联系管理员。
        </p>
      </div>

      <Button @click="goBack" variant="text" icon="pi pi-arrow-left" label="返回" />

      <!-- 额外信息 -->
      <div
        class="text-surface-500 dark:text-surface-400 mt-16 flex flex-col items-center justify-center gap-8 text-sm sm:flex-row"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-info-circle"></i>
          <span>错误代码: 401</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-clock"></i>
          <span>{{ now.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- 底部波浪装饰 -->
    <div class="absolute right-0 bottom-0 left-0 h-32 opacity-30">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="h-full w-full">
        <path
          d="M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,0 1200,60 L1200,120 L0,120 Z"
          class="fill-primary-300 dark:fill-primary-700"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const now = useNow()

const goBack = () => {
  router.back()
}
</script>

<style scoped></style>
