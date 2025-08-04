<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import Toast from 'primevue/toast'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <Toast />
  <RouterView />
  <PiniaColadaDevtools />
</template>

<style scoped></style>
