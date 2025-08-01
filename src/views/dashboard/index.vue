<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import AppTopbar from './components/AppTopbar.vue'
import ProductOverviewWidget from './components/ProductOverviewWidget.vue'
import RecentActivityWidget from './components/RecentActivityWidget.vue'
import SalesTrendWidget from './components/SalesTrendWidget.vue'
import StatsWidget from './components/StatsWidget.vue'
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex min-h-screen flex-col gap-6 p-8">
    <AppTopbar />
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
      <StatsWidget />
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SalesTrendWidget />
        <RecentActivityWidget />
      </div>
      <ProductOverviewWidget />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
