<script setup lang="ts"></script>

<template>
  <div class="flex w-full flex-col gap-6 p-4 sm:w-auto">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div class="flex-auto">
        <label for="firstname" class="mb-2 block font-semibold">Firstname</label>
        <InputText id="firstname" class="w-full" />
      </div>
      <div class="flex-auto">
        <label for="lastname" class="mb-2 block font-semibold">Lastname</label>
        <InputText id="lastname" class="w-full" />
      </div>
      <div class="flex-auto">
        <label for="date" class="mb-2 block font-semibold">Date</label>
        <DatePicker inputId="date" class="w-full" dateFormat="yy-mm-dd" />
      </div>
    </div>
    <div class="flex-auto">
      <label for="message" class="mb-2 block font-semibold">Message</label>
      <Textarea id="message" class="w-full" rows="4" />
    </div>

    <Button
      type="button"
      label="Messages"
      icon="pi pi-inbox"
      badge="2"
      variant="outlined"
      severity="secondary"
      :pt="{
        root: 'px-4 py-3!',
        icon: '!text-xl !text-violet-500 dark:!text-violet-400',
        label: '!text-lg !text-violet-500 dark:!text-violet-400',
        pcBadge: {
          root: '!bg-violet-500 dark:!bg-violet-400 !text-white dark:!text-black',
        },
      }"
    />
  </div>
</template>

<style scoped></style>
