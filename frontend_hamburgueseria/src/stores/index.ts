import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'
import type { Producto } from '@/models/producto'
import type { Venta } from '@/models/venta'

const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }

    return {
      user,
      token: getTokenFromLocalStorage(),
      returnUrl: '',
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userDetails: (state) => state.user,
  },
  actions: {
    async login(usuario: string, clave: string) {
      try {
        const response = await http.post('auth/login', { usuario, clave });
        const { access_token, ...userData } = response.data;

        this.user = userData;
        this.token = access_token;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token || '');

        router.push(this.returnUrl || '/');
      } catch (error) {
        throw error;
      }
    },
    async register(usuario: string, clave: string) {
      try {
        const response = await http.post('auth/register', { usuario, clave });
        // Assuming register returns user data or success
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    logout() {
      localStorage.clear();
      this.$reset();
      router.push('login');
    },
  },
});

interface CartItem {
  id: number
  imagen: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  quantity: number
}

const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    cartItems: (state) => state.items,
    totalPrice: (state) => state.items.reduce((total, item) => total + item.precio * item.quantity, 0),
    itemCount: (state) => state.items.length,
  },
  actions: {
    addToCart(product: Producto) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(item: CartItem) {
      this.items = this.items.filter(cartItem => cartItem.id !== item.id)
    },
    increaseQuantity(item: CartItem) {
      item.quantity += 1
    },
    decreaseQuantity(item: CartItem) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        this.removeFromCart(item)
      }
    },
    clearCart() {
      this.items = []
    },
  },
})

export { useAuthStore, useCartStore }
