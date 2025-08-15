<template>
  <!-- 布局配置面板 -->
  <div class="layout-configurator p-4">
    <!-- 面板头部 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="from-primary-400 to-primary-600 rounded-xl bg-gradient-to-br p-2 shadow-lg">
          <i class="pi pi-palette text-primary-contrast text-lg"></i>
        </div>
        <div>
          <h3 class="text-surface-900 dark:text-surface-100 text-lg font-bold">布局配置</h3>
          <p class="text-surface-500 dark:text-surface-400 text-xs">个性化您的界面</p>
        </div>
      </div>
      <div class="flex items-center space-x-1">
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          text
          rounded
          size="small"
          @click="resetToDefault"
          v-tooltip.left="'重置配置'"
          class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200"
        />
        <Button
          icon="pi pi-times"
          severity="secondary"
          text
          rounded
          size="small"
          class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200"
          @click="$emit('close')"
          v-tooltip.left="'关闭'"
        />
      </div>
    </div>

    <!-- 配置内容 -->
    <div class="space-y-6">
      <!-- 主题模式 -->
      <div>
        <label class="text-surface-900 dark:text-surface-100 mb-3 block text-sm font-medium">
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
      <div class="border-surface-200 dark:border-surface-700 sr-only border-t"></div>

      <!-- 布局模式 -->
      <div class="sr-only">
        <label class="text-surface-900 dark:text-surface-100 mb-3 block text-sm font-medium">
          布局模式
        </label>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="mode in layoutModeOptions"
            :key="mode.key"
            :class="[
              'relative cursor-pointer rounded-lg border-2 p-3 transition-all',
              currentLayoutMode === mode.key
                ? 'border-primary bg-primary/5'
                : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
            ]"
            @click="setLayoutMode(mode.key as any)"
          >
            <div class="mb-2 flex items-center justify-center">
              <i :class="[mode.icon, 'text-surface-600 dark:text-surface-400 text-lg']"></i>
            </div>
            <p class="text-surface-700 dark:text-surface-300 text-center text-xs font-medium">
              {{ mode.label }}
            </p>
            <p class="text-surface-500 dark:text-surface-400 mt-1 text-center text-xs">
              {{ mode.description }}
            </p>
            <div
              v-if="currentLayoutMode === mode.key"
              class="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
            >
              <i class="pi pi-check text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="border-surface-200 dark:border-surface-700 border-t"></div>

      <!-- 主题色彩配置 -->
      <div>
        <label class="text-surface-900 dark:text-surface-100 mb-3 block text-sm font-medium">
          主题色彩
        </label>

        <div class="grid grid-cols-6 gap-2">
          <!-- 预设色彩 -->
          <div
            v-for="preset in presetColors"
            :key="preset.name"
            :class="[
              'relative cursor-pointer rounded-lg border-2 p-1 transition-all hover:scale-105',
              currentPresetName === preset.name && !isCustomColor
                ? 'border-primary shadow-lg'
                : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
            ]"
            @click="setPresetColor(preset.name)"
            :title="preset.name"
          >
            <div class="h-6 w-full rounded" :style="{ backgroundColor: preset.palette[500] }"></div>
            <div
              v-if="currentPresetName === preset.name && !isCustomColor"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md"
            >
              <i class="pi pi-check text-xs" :style="{ color: preset.palette[500] }"></i>
            </div>
          </div>

          <!-- 自定义色彩 -->
          <div
            :class="[
              'relative cursor-pointer rounded-lg border-2 p-1 transition-all hover:scale-105',
              isCustomColor
                ? 'border-primary ring-primary/20 shadow-lg ring-2'
                : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
            ]"
            :title="isCustomColor ? `自定义色彩: ${currentPrimary}` : '自定义色彩'"
          >
            <ColorPicker
              v-model="primaryColor"
              format="hex"
              class="h-6 w-full rounded border-0 p-0"
            />
            <div
              v-if="isCustomColor"
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md"
            >
              <i class="pi pi-palette text-primary text-xs"></i>
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
  currentTheme,
  setTheme,
  resetToDefault,
  primaryColor,
  currentPrimary,
  currentPresetName,
  isCustomColor,
  presetColors,
  setPresetColor,
  currentLayoutMode,
  setLayoutMode,
} = useLayout()

// 主题选项
const themeOptions = ref([
  { key: 'light', label: '亮色', icon: 'pi pi-sun' },
  { key: 'dark', label: '暗色', icon: 'pi pi-moon' },
  { key: 'system', label: '跟随系统', icon: 'pi pi-desktop' },
])

// 布局模式选项
const layoutModeOptions = ref([
  {
    key: 'sidebar-topbar',
    label: '侧栏+顶栏',
    icon: 'pi pi-th-large',
    description: '经典布局，菜单在侧栏',
  },
  {
    key: 'topbar-only',
    label: '仅顶栏',
    icon: 'pi pi-minus',
    description: '简洁布局，菜单在顶栏',
  },
])
</script>
