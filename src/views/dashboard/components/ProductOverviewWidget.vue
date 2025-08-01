<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const products = ref([
  {
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 2499,
    status: 'In Stock',
  },
  {
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 49,
    status: 'Low Stock',
  },
  {
    name: 'Monitor 4K',
    category: 'Electronics',
    price: 699,
    status: 'Out of Stock',
  },
  { name: 'Keyboard', category: 'Accessories', price: 149, status: 'In Stock' },
])

const selectedProduct = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const filteredProducts = ref<any>([])

const searchProducts = () => {
  loading.value = true
  filteredProducts.value = products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.status.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  setTimeout(() => {
    loading.value = false
  }, 300)
}

watch(searchQuery, () => {
  searchProducts()
})

onMounted(() => {
  filteredProducts.value = [...products.value]
})
</script>

<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex flex-col gap-4 rounded-xl border p-6"
  >
    <div class="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <span class="text-base font-medium">Products Overview</span>
      <IconField class="w-full sm:w-auto">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Search products..."
          class="p-inputtext-sm w-full! md:w-auto!"
          @keyup.enter="searchProducts"
        />
      </IconField>
    </div>
    <div class="flex flex-col gap-2">
      <DataTable
        :value="filteredProducts"
        v-model:selection="selectedProduct"
        selectionMode="single"
        :loading="loading"
        :rows="5"
        :pt="{
          mask: {
            class: 'backdrop-blur-sm! bg-surface-0/20! dark:bg-surface-900/20!',
          },
          loadingIcon: {
            class: 'text-primary!',
          },
        }"
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="category" header="Category" sortable></Column>
        <Column field="price" header="Price" sortable>
          <template #body="{ data }"> ${{ data.price }} </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :severity="
                data.status === 'In Stock'
                  ? 'success'
                  : data.status === 'Low Stock'
                    ? 'warn'
                    : 'danger'
              "
            >
              {{ data.status }}
            </Tag>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
