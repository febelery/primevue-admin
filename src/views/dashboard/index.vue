<script setup lang="ts">
import ProductOverviewWidget from './components/ProductOverviewWidget.vue'
import RecentActivityWidget from './components/RecentActivityWidget.vue'
import SalesTrendWidget from './components/SalesTrendWidget.vue'
import StatsWidget from './components/StatsWidget.vue'
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex flex-col gap-6 p-8">
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
      <StatsWidget />
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SalesTrendWidget />
        <RecentActivityWidget />
      </div>
      <ProductOverviewWidget />
    </div>
  </div>
</template>
