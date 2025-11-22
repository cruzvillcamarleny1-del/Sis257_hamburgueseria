import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Producto } from '@/models/producto'

export interface CartItem {
  producto: Producto
  cantidad: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // Load cart from localStorage on initialization
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed: CartItem[] = JSON.parse(savedCart)
        // Sanitize loaded data
        items.value = Array.isArray(parsed)
          ? parsed
              .filter(it => it && it.producto && typeof it.cantidad === 'number')
              .map(it => ({
                producto: {
                  ...it.producto,
                  // Ensure numeric precio
                  precio: Number(it.producto.precio) || 0
                } as Producto,
                // Ensure integer quantity >= 1
                cantidad: Math.max(1, Math.trunc(Number(it.cantidad) || 1))
              }))
          : []
      } catch (error) {
        console.error('Error cargando el carrito desde localStorage:', error)
        items.value = []
      }
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    // Persist a minimal serializable snapshot
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // Add product to cart
  const addToCart = (producto: Producto, cantidad: number = 1) => {
    const qty = Math.max(1, Math.trunc(Number(cantidad) || 1))
    const existingItem = items.value.find(item => item.producto.id === producto.id)
    const stockNum = Number((producto as any).stock)
    const max = Number.isFinite(stockNum) && stockNum > 0 ? stockNum : Infinity

    if (existingItem) {
      existingItem.cantidad = Math.min(existingItem.cantidad + qty, max)
    } else {
      const initialQty = Math.min(qty, max)
      if (initialQty > 0) {
        items.value.push({
          producto: { ...producto, precio: Number(producto.precio) || 0 },
          cantidad: initialQty
        })
      }
    }

    saveCart()
  }

  // Remove product from cart
  const removeFromCart = (productoId: number) => {
    const index = items.value.findIndex(item => item.producto.id === productoId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  // Update quantity of a product in cart
  const updateQuantity = (productoId: number, cantidad: number) => {
    const item = items.value.find(item => item.producto.id === productoId)
    if (item) {
      const stockNum = Number((item.producto as any).stock)
      const max = Number.isFinite(stockNum) && stockNum > 0 ? stockNum : Infinity
      const qty = Math.trunc(Number(cantidad) || 0)

      if (qty <= 0) {
        removeFromCart(productoId)
      } else {
        item.cantidad = Math.min(qty, max)
        saveCart()
      }
    }
  }

  // Clear entire cart
  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Computed properties
  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.cantidad, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + ((Number(item.producto.precio) || 0) * item.cantidad), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Initialize cart on store creation
  loadCart()

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  }
})
