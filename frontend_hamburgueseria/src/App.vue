<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { useCarritoStore } from '@/stores/carrito'

import '@/assets/js/jquery-3.4.1.min.js'
import '@/assets/js/custom.js'
import '@/assets/js/bootstrap.js'

import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const cartOpen = ref(false)
const carrito = useCarritoStore()

function toggleCart() {
  cartOpen.value = !cartOpen.value
}
</script>

<template>
  <main>
    <MainHeader />
    <!-- SIDEBAR DEL CARRITO -->
    <div class="cart-sidebar" :class="{ open: carrito.sidebarAbierto }">
      <div class="cart-header">
        <h3>Carrito de Compras</h3>
        <button class="close-btn" @click="carrito.cerrarSidebar()">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="cart-content">
        <div v-if="carrito.items.length === 0" class="empty-cart">
          <i class="pi pi-shopping-cart"></i>
          <p>Tu carrito está vacío</p>
        </div>
        <div v-else class="cart-items">
          <div v-for="item in carrito.items" :key="item.id" class="cart-item">
            <div class="item-info">
              <h4>{{ item.nombre }}</h4>
              <p>{{ item.descripcion }}</p>
              <span class="item-price">{{ item.precio }} Bs</span>
            </div>
            <div class="item-actions">
              <button
                @click="carrito.actualizarCantidad(item.id, item.cantidad - 1)"
                :disabled="item.cantidad <= 1"
              >
                -
              </button>
              <span class="quantity">{{ item.cantidad }}</span>
              <button @click="carrito.actualizarCantidad(item.id, item.cantidad + 1)">+</button>
              <button @click="carrito.quitar(item.id)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
      <div class="cart-footer" v-if="carrito.items.length > 0">
        <div class="cart-total">
          <strong>Total: {{ carrito.total }} Bs</strong>
        </div>
        <button class="checkout-button" @click="$router.push('/checkout')">Ir a pagar</button>
      </div>
    </div>
    <RouterView />
  </main>
  <MainFooter />
</template>
<style>
@import '@/assets/css/style.css';
@import '@/assets/css/bootstrap.css';
@import '@/assets/css/font-awesome.min.css';
@import '@/assets/css/responsive.css';

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: #353535;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 2000;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}
.cart-sidebar.open {
  right: 0;
}
.cart-header {
  color: #ffbe33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ffd501;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #d72323;
  cursor: pointer;
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
  background: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #eee;
}
.item-info h4 {
  color: #ffbe33;
  margin-bottom: 0.25rem;
}
.item-info p {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.item-price {
  font-weight: bold;
  color: #d72323;
}
.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.item-actions button {
  background: #ffbe33;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.item-actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  color: #222;
}
.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
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
  color: #fff;
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 10px;
  transition: background 0.2s;
  cursor: pointer;
}
.checkout-button:hover {
  background: linear-gradient(135deg, #d72323, #ffbe33);
}
@media (max-width: 768px) {
  .cart-sidebar {
    width: 100vw;
    right: -100vw;
  }
  .cart-sidebar.open {
    right: 0;
  }
}
</style>
