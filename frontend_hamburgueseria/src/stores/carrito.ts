import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ItemCarrito {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  cantidad: number
  imagen?: string
}

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref<ItemCarrito[]>([])
  const sidebarAbierto = ref(false)

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.cantidad, 0)
  )

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  )

  function agregar(producto: ItemCarrito) {
    const existente = items.value.find(i => i.id === producto.id)
    if (existente) {
      existente.cantidad += producto.cantidad
    } else {
      items.value.push({ ...producto })
    }
    sidebarAbierto.value = true // <-- ABRE EL SIDEBAR
  }

  function quitar(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function vaciar() {
    items.value = []
  }

  function actualizarCantidad(id: number, cantidad: number) {
    const item = items.value.find(i => i.id === id)
    if (item && cantidad > 0) item.cantidad = cantidad
  }

  function cerrarSidebar() {
    sidebarAbierto.value = false
  }

  return {
    items,
    itemCount,
    total,
    sidebarAbierto,
    agregar,
    quitar,
    vaciar,
    actualizarCantidad,
    cerrarSidebar,
  }
})
