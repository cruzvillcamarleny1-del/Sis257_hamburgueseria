<template>
  <div id="app">
    <div class="navbar" v-if="showNavbar">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <i class="pi pi-star"></i>
          Hamburguesería
        </router-link>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-link">Inicio</router-link>
        <router-link to="/ventas" class="nav-link">Ventas</router-link>
        <router-link to="/productos" class="nav-link">Productos</router-link>
        <router-link to="/clientes" class="nav-link">Clientes</router-link>
        <router-link to="/proveedores" class="nav-link">Proveedores</router-link>
        <router-link to="/about" class="nav-link">Acerca de</router-link>
      </div>
      <div class="navbar-actions">
        <div class="cart-icon" @click="toggleCart">
          <i class="pi pi-shopping-cart"></i>
          <span class="cart-count" v-if="cartStore.itemCount > 0">{{ cartStore.itemCount }}</span>
        </div>
        <Button
          v-if="!isLoggedIn"
          label="Iniciar Sesión"
          @click="$router.push('/login')"
          class="login-button"
        />
        <Button
          v-else
          label="Cerrar Sesión"
          @click="logout"
          class="logout-button"
        />
      </div>
    </div>

    <div class="cart-sidebar" :class="{ open: cartOpen }" v-if="showNavbar">
      <div class="cart-header">
        <h3>Carrito de Compras</h3>
        <Button icon="pi pi-times" class="p-button-text" @click="toggleCart" />
      </div>
      <div class="cart-content">
        <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
          <i class="pi pi-shopping-cart"></i>
          <p>Tu carrito está vacío</p>
        </div>
        <div v-else class="cart-items">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-item">
            <div class="item-info">
              <h4>{{ item.nombre }}</h4>
              <p>{{ item.descripcion }}</p>
              <span class="item-price">${{ item.precio }}</span>
            </div>
            <div class="item-actions">
              <Button
                icon="pi pi-minus"
                class="p-button-rounded p-button-outlined"
                @click="cartStore.decreaseQuantity(item)"
              />
              <span class="quantity">{{ item.quantity }}</span>
              <Button
                icon="pi pi-plus"
                class="p-button-rounded p-button-outlined"
                @click="cartStore.increaseQuantity(item)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-text"
                @click="cartStore.removeFromCart(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="cart-footer" v-if="cartStore.cartItems.length > 0">
        <div class="cart-total">
          <strong>Total: ${{ cartStore.totalPrice.toFixed(2) }}</strong>
        </div>
        <Button label="Enviar Pedido" class="checkout-button" @click="submitOrder" />
      </div>
    </div>

    <main :style="{ paddingTop: showNavbar ? '80px' : '0' }">
      <router-view />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore, useCartStore } from '@/stores'
import Button from 'primevue/button'
import http from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()

const cartOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const showNavbar = computed(() => route.name !== 'login' && route.name !== 'register')

const toggleCart = () => {
  cartOpen.value = !cartOpen.value
}

const submitOrder = async () => {
  if (!authStore.user) {
    alert('Debe iniciar sesión para enviar un pedido');
    return;
  }

  const ventaDto = {
    fecha: new Date().toISOString(),
    total: cartStore.totalPrice,
    idUsuario: authStore.user.id,
    // TODO: Implementar selección de cliente
    idCliente: 1, // Hardcoded para demostración
    detalleVenta: cartStore.cartItems.map(item => ({
      idProducto: item.id,
      cantidad: item.quantity,
      precioUnitario: item.precio,
      subtotal: item.precio * item.quantity,
    })),
  };

  try {
    await http.post('ventas', ventaDto);
    alert('Pedido enviado exitosamente');
    cartStore.clearCart();
    toggleCart();
  } catch (error) {
    console.error('Error al enviar el pedido:', error);
    alert('Error al enviar el pedido');
  }
}

const logout = () => {
  authStore.logout()
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #1d1f21;
  color: #fff;
}

#app {
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(29, 31, 33, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 190, 51, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-brand .brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffbe33;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #ffbe33;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffbe33;
  transition: color 0.3s ease;
}

.cart-icon:hover {
  color: #ffd666;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d72323;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.login-button,
.logout-button {
  background: linear-gradient(135deg, #ffbe33, #d72323);
  border: none;
  color: #1d1f21;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: transform 0.3s ease;
}

.login-button:hover,
.logout-button:hover {
  transform: translateY(-2px);
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: rgba(29, 31, 33, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 190, 51, 0.2);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 190, 51, 0.2);
}

.cart-header h3 {
  color: #ffbe33;
  margin: 0;
}

.cart-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.empty-cart {
  text-align: center;
  color: #ccc;
  margin-top: 3rem;
}

.empty-cart i {
  font-size: 4rem;
  color: #ffbe33;
  margin-bottom: 1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 190, 51, 0.1);
}

.item-info h4 {
  color: #ffbe33;
  margin-bottom: 0.25rem;
}

.item-info p {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price {
  font-weight: bold;
  color: #ffd666;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 190, 51, 0.2);
}

.cart-total {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.checkout-button {
  width: 100%;
  background: linear-gradient(135deg, #ffbe33, #d72323);
  border: none;
  color: #1d1f21;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.checkout-button:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }

  .cart-sidebar {
    width: 100vw;
    right: -100vw;
  }

  .cart-sidebar.open {
    right: 0;
  }
}
</style>
