<template>
  <!-- 布局配置下拉面板 -->
  <div
    class="layout-configurator bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-lg border shadow-xl"
  >
    <!-- 面板头部 -->
    <div
      class="border-surface-200 dark:border-surface-700 flex items-center justify-between border-b px-4 py-3"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-palette text-primary text-lg"></i>
        <h3 class="text-surface-900 dark:text-surface-100 text-base font-semibold">布局配置</h3>
      </div>
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

    <!-- 配置内容 -->
    <div class="max-h-[65vh] overflow-y-auto">
      <div class="space-y-3 p-3">
        <!-- 快速操作 -->
        <div class="flex items-center justify-between gap-2">
          <Button
            :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            severity="secondary"
            text
            size="small"
            @click="toggleTheme"
            v-tooltip.bottom="isDarkMode ? '切换到亮色主题' : '切换到暗色主题'"
            class="flex-1"
          />
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            text
            size="small"
            @click="resetToDefault"
            v-tooltip.bottom="'重置配置'"
            class="flex-1"
          />
          <Button
            icon="pi pi-sparkles"
            severity="secondary"
            text
            size="small"
            @click="randomizeTheme"
            v-tooltip.bottom="'随机主题'"
            class="flex-1"
          />
        </div>

        <!-- 分隔线 -->
        <div class="border-surface-200 dark:border-surface-700 border-t"></div>

        <!-- 主题模式 -->
        <div>
          <label class="text-surface-900 dark:text-surface-100 mb-2 block text-sm font-medium">
            主题模式
          </label>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="theme in themeOptions"
              :key="theme.key"
              :class="[
                'relative cursor-pointer rounded-lg border-2 p-2 transition-all',
                currentTheme === theme.key
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
              ]"
              @click="setTheme(theme.key as any)"
            >
              <div
                class="bg-surface-100 dark:bg-surface-800 mb-1 flex h-8 items-center justify-center rounded"
              >
                <i :class="[theme.icon, 'text-surface-600 dark:text-surface-400 text-sm']"></i>
              </div>
              <p class="text-surface-700 dark:text-surface-300 text-center text-xs font-medium">
                {{ theme.label }}
              </p>
              <div
                v-if="currentTheme === theme.key"
                class="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
              >
                <i class="pi pi-check text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="border-surface-200 dark:border-surface-700 border-t"></div>

        <!-- 主题色彩 -->
        <div>
          <label class="text-surface-900 dark:text-surface-100 mb-2 block text-sm font-medium">
            主题色彩
          </label>
          <div class="grid grid-cols-8 gap-2">
            <div
              v-for="color in primaryColors"
              :key="color.name"
              :class="[
                'relative h-8 w-8 cursor-pointer rounded-lg border-2 transition-all',
                currentPrimary === color.name
                  ? 'border-surface-900 dark:border-surface-100 scale-110'
                  : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
              ]"
              :style="{ backgroundColor: color.palette[500] }"
              @click="setPrimary(color.name)"
              v-tooltip.bottom="color.label || color.name"
            >
              <div
                v-if="currentPrimary === color.name"
                class="absolute inset-0 flex items-center justify-center text-white"
              >
                <i class="pi pi-check text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 表面色彩 -->
        <div>
          <label class="text-surface-900 dark:text-surface-100 mb-2 block text-sm font-medium">
            表面色彩
          </label>
          <div class="grid grid-cols-6 gap-2">
            <div
              v-for="surface in surfaces"
              :key="surface.name"
              :class="[
                'relative h-8 w-8 cursor-pointer rounded-lg border-2 transition-all',
                currentSurface === surface.name
                  ? 'border-surface-900 dark:border-surface-100 scale-110'
                  : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
              ]"
              :style="{ backgroundColor: surface.palette[500] }"
              @click="setSurface(surface.name)"
              v-tooltip.bottom="surface.label || surface.name"
            >
              <div
                v-if="currentSurface === surface.name"
                class="absolute inset-0 flex items-center justify-center text-white"
              >
                <i class="pi pi-check text-xs"></i>
              </div>
            </div>
            <!-- 重置表面色彩 -->
            <div
              :class="[
                'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 transition-all',
                !currentSurface
                  ? 'border-surface-900 dark:border-surface-100 scale-110'
                  : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
              ]"
              @click="setSurface(null)"
              v-tooltip.bottom="'默认'"
            >
              <i class="pi pi-times text-surface-500 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from '@/composables/useLayout'
import { ref } from 'vue'

// 定义事件
defineEmits<{
  close: []
}>()

// 使用布局配置
const {
  primaryColors,
  surfaces,
  isDarkMode,
  currentTheme,
  currentPrimary,
  currentSurface,
  setTheme,
  toggleTheme,
  setPrimary,
  setSurface,
  resetToDefault,
  randomizeTheme,
} = useLayout()

// 主题选项
const themeOptions = ref([
  { key: 'light', label: '亮色', icon: 'pi pi-sun' },
  { key: 'dark', label: '暗色', icon: 'pi pi-moon' },
  { key: 'system', label: '跟随系统', icon: 'pi pi-desktop' },
])
</script>
