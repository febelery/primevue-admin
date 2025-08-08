<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const { initTheme, theme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <RouterView />
  <PiniaColadaDevtools />
  <Toaster position="top-right" richColors :theme="theme" />
</template>

<style scoped></style>
