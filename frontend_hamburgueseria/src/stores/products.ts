import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'

export const useProductsStore = defineStore('products', () => {
  const items = ref<Producto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await http.get('productos')
      items.value = Array.isArray(data) ? data : []
    } catch (e: any) {
      console.error('Error cargando productos:', e)
      error.value = e?.message || 'Error al cargar productos'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  function invalidate() {
    items.value = []
  }

  return { items, loading, error, fetchAll, invalidate }
})
