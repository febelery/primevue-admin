<script setup lang="ts">
import { useLayout } from '@/composables/useLayout'
import { ref, onMounted, watch } from 'vue'

const chartData = ref<any>(null)
const chartOptions = ref<any>(null)

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        type: 'bar',
        label: 'Subscriptions',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
        data: [4000, 10000, 15000, 4000],
        barThickness: 32,
      },
      {
        type: 'bar',
        label: 'Advertising',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
        data: [2100, 8400, 2400, 7500],
        barThickness: 32,
      },
      {
        type: 'bar',
        label: 'Affiliate',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
        data: [4100, 5200, 3400, 7400],
        borderRadius: {
          topLeft: 8,
          topRight: 8,
        },
        barThickness: 32,
      },
    ],
  }
}

function setChartOptions() {
  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
          drawTicks: false,
        },
      },
    },
  }
}

const { themeConfig } = useLayout()

// 更新图表数据的函数
const updateChart = () => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
}

onMounted(() => {
  updateChart()
})

// 监听主题变化，重新更新图表颜色
watch(
  () => [themeConfig.value.primary, themeConfig.value.isDark],
  () => {
    // 延迟一点时间确保 CSS 变量已更新
    setTimeout(updateChart, 100)
  },
  { deep: true },
)
</script>

<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex flex-col gap-4 rounded-xl border p-6"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <span class="text-base font-medium">Sales Trend</span>
      </div>
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[300px]" />
    </div>
  </div>
</template>
