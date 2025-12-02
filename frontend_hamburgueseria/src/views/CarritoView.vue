<script setup lang="ts">
import { useCarritoStore } from '@/stores/carrito'
const carrito = useCarritoStore()
</script>

<template>
  <div class="carrito-container">
    <h2>🛒 Carrito de compras</h2>
    <div v-if="carrito.items.length">
      <div class="carrito-list">
        <div v-for="item in carrito.items" :key="item.id" class="carrito-item">
          <img v-if="item.imagen" :src="item.imagen" alt="img" class="carrito-img" />
          <div class="carrito-info">
            <h4>{{ item.nombre }}</h4>
            <div class="carrito-controls">
              <button @click="carrito.actualizarCantidad(item.id, item.cantidad - 1)" :disabled="item.cantidad <= 1">-</button>
              <span>{{ item.cantidad }}</span>
              <button @click="carrito.actualizarCantidad(item.id, item.cantidad + 1)">+</button>
            </div>
            <div class="carrito-precio">
              <span>{{ item.precio }} Bs c/u</span>
              <span>Total: <strong>{{ item.precio * item.cantidad }} Bs</strong></span>
            </div>
          </div>
          <button class="carrito-remove" @click="carrito.quitar(item.id)">🗑️</button>
        </div>
      </div>
      <div class="carrito-total">
        <strong>Total a pagar: {{ carrito.total }} Bs</strong>
      </div>
      <div class="carrito-actions">
        <button class="btn vaciar" @click="carrito.vaciar()">Vaciar carrito</button>
        <button class="btn pagar" @click="$router.push('/checkout')">Ir a pagar</button>
      </div>
    </div>
    <div v-else class="carrito-empty">
      <i class="pi pi-shopping-cart" style="font-size: 3rem; color: #ffbe33;"></i>
      <p>Tu carrito está vacío.</p>
    </div>
  </div>
</template>

<style scoped>
.carrito-container {
  max-width: 600px;
  margin: 6rem auto 2rem auto; /* margen superior aumentado */
  background: #423e3e;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2rem;
  color: #222;
}
h2 {
  text-align: center;
  color: #ffbe33;
  margin-bottom: 2rem;
}
.carrito-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.carrito-item {
  display: flex;
  align-items: center;
  background: #dbdbd4;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  position: relative;
}
.carrito-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
  border: 1px solid #ffbe33;
}
.carrito-info {
  flex: 1;
}
.carrito-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
.carrito-controls button {
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
.carrito-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.carrito-precio {
  display: flex;
  gap: 2rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}
.carrito-remove {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #d72323;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.2s;
}
.carrito-remove:hover {
  color: #ffbe33;
}
.carrito-total {
  text-align: right;
  font-size: 1.2rem;
  margin: 2rem 0 1rem 0;
  color: #d72323;
}
.carrito-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.btn {
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.vaciar {
  background: #ccc;
  color: #222;
}
.pagar {
  background: linear-gradient(135deg, #ffbe33, #d72323);
  color: #fff;
}
.carrito-empty {
  text-align: center;
  color: #888;
  margin: 3rem 0;
}
</style>
