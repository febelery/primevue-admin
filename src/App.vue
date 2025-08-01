<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
