<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <RouterView />
  <PiniaColadaDevtools />
</template>

<style scoped></style>
