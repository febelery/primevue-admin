<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <RouterView />
  <PiniaColadaDevtools />
  <Toaster position="top-right" richColors />
</template>

<style scoped></style>
