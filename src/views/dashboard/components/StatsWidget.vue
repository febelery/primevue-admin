<script setup lang="ts">
const stats = [
  {
    title: 'Total Orders',
    icon: 'pi-shopping-cart',
    value: '1,234',
    subtitle: 'Last 7 days',
  },
  {
    title: 'Active Users',
    icon: 'pi-users',
    value: '2,573',
    subtitle: 'Last 7 days',
  },
  {
    title: 'Revenue',
    icon: 'pi-dollar',
    value: '$45,200',
    subtitle: 'Last 7 days',
  },
  {
    title: 'Success Rate',
    icon: 'pi-chart-line',
    value: '95%',
    subtitle: 'Last 7 days',
  },
]
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex flex-col gap-2 rounded-xl border p-6"
    >
      <div class="flex items-start justify-between gap-2">
        <span class="text-xl leading-tight font-light">{{ stat.title }}</span>
        <span
          class="bg-primary-100 dark:bg-primary-400/20 text-primary border-primary-200 dark:border-primary-400/40 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
        >
          <i :class="['pi', stat.icon, 'text-xl!', 'leading-none!']"></i>
        </span>
      </div>
      <div class="flex w-full flex-col gap-1">
        <div class="text-3xl leading-tight font-medium">{{ stat.value }}</div>
        <div class="text-surface-600 dark:text-surface-400 text-sm leading-tight">
          {{ stat.subtitle }}
        </div>
      </div>
    </div>
  </div>
</template>
