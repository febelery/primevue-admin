<script setup lang="ts">
import { useLayout } from '@/views/dashboard/components/useLayout'

const { primaryColors, surfaces, primary, surface, isDarkMode, updateColors } = useLayout()
</script>

<template>
  <div
    class="dark:bg-surface-900 border-surface-200 dark:border-surface-700 absolute top-16 right-0 z-50 hidden w-64 origin-top rounded-md border bg-white p-4 shadow-lg"
  >
    <div class="flex flex-col gap-4">
      <div>
        <span class="text-surface-600 dark:text-surface-400 text-sm font-semibold">Primary</span>
        <div class="flex flex-wrap justify-between gap-2 pt-2">
          <button
            v-for="pc of primaryColors"
            :key="pc.name"
            type="button"
            :title="pc.name"
            :class="[
              'h-5 w-5 cursor-pointer rounded-full border-none p-0 focus:ring-2 focus:ring-offset-2 focus:outline-none',
              { 'ring-primary ring-2 ring-offset-2': primary === pc.name },
            ]"
            :style="{ backgroundColor: pc.palette['500'] }"
            @click="updateColors('primary', pc.name)"
          />
        </div>
      </div>
      <div>
        <span class="text-surface-600 dark:text-surface-400 text-sm font-semibold">Surface</span>
        <div class="flex flex-wrap justify-between gap-2 pt-2">
          <button
            v-for="s of surfaces"
            :key="s.name"
            type="button"
            :title="s.name"
            :class="[
              'h-5 w-5 cursor-pointer rounded-full border-none p-0 focus:ring-2 focus:ring-offset-2 focus:outline-none',
              {
                'ring-primary ring-2 ring-offset-2': surface
                  ? surface === s.name
                  : isDarkMode
                    ? s.name === 'zinc'
                    : s.name === 'slate',
              },
            ]"
            :style="{ backgroundColor: s.palette['500'] }"
            @click="updateColors('surface', s.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
