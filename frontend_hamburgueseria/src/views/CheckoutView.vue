<script setup lang="ts">
import { useCarritoStore } from '@/stores/carrito'
import { ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const carrito = useCarritoStore()
const metodoPago = ref('qr')
const direccionEnvio = ref('')
const advertencia = ref('')

async function confirmarPedido() {
  const idCliente = Number(localStorage.getItem('id_cliente'))
  if (!idCliente) {
    advertencia.value = 'Debes iniciar sesión o registrarte para continuar con el pago.'
    setTimeout(() => {
      advertencia.value = ''
      router.push('/login')
    }, 1800)
    return
  }
  const detalles = carrito.items.map((item) => ({
    idProducto: item.id,
    cantidad: item.cantidad,
    precioUnitario: item.precio,
  }))
  const pedido = {
    idCliente,
    fecha: new Date(),
    total: carrito.total,
    estado: 'pendiente',
    metodoPago: metodoPago.value,
    direccionEnvio: direccionEnvio.value,
    detalles,
  }
  await http.post('/pedidos', pedido)
  carrito.vaciar()
  router.push('/pedidos-cliente')
}
</script>

<template>
  <div class="checkout-container">
    <div v-if="advertencia" class="toast-advertencia">
      {{ advertencia }}
    </div>
    <h2>Confirmar Pedido</h2>
    <div v-if="carrito.items.length">
      <ul>
        <li v-for="item in carrito.items" :key="item.id">
          {{ item.nombre }} x {{ item.cantidad }} - {{ item.precio * item.cantidad }} Bs
        </li>
      </ul>
      <div>
        <strong>Total: {{ carrito.total }} Bs</strong>
      </div>
      <div>
        <label>Método de pago:</label>
        <select v-model="metodoPago">
          <option value="qr">QR</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>
      <div v-if="metodoPago === 'qr'" class="qr-section">
        <img src="@/assets/images/qr_ejemplo.png" alt="QR de pago" style="max-width: 200px" />
        <p>Escanea el código QR para pagar.</p>
      </div>
      <div v-if="metodoPago === 'tarjeta'" class="tarjeta-section">
        <input type="text" placeholder="Número de tarjeta" />
        <input type="text" placeholder="Nombre en la tarjeta" />
        <input type="text" placeholder="Fecha de vencimiento" />
        <input type="text" placeholder="CVV" />
      </div>
      <div v-if="metodoPago === 'efectivo'" class="efectivo-section">
        <p>Pagarás en efectivo al recibir tu pedido.</p>
      </div>
      <div>
        <label>Dirección de envío:</label>
        <input v-model="direccionEnvio" type="text" placeholder="Dirección" />
      </div>
      <button @click="confirmarPedido">Confirmar pedido</button>
    </div>
    <div v-else>
      <p>Tu carrito está vacío.</p>
    </div>
  </div>
</template>

<style scoped>
.toast-advertencia {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #d72323;
  color: #fff;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  z-index: 9999;
  animation: fadeInOut 2s;
}
@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
