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
      router.push('/login-cliente')
    }, 1800)
    return
  }

  const detalles = carrito.items.map((item) => ({
    idProducto: Number(item.id),
    cantidad: Number(item.cantidad),
    precioUnitario: Number(item.precio),
  }))

  const pedido = {
    idCliente,
    fecha: new Date().toISOString(),
    total: carrito.total,
    estado: 'pendiente',
    metodoPago: metodoPago.value,
    direccionEnvio: direccionEnvio.value,
    detalles,
  }

  try {
    await http.post('/pedidos', pedido)
    carrito.vaciar()
    router.push('/pedidos-cliente')
  } catch (error: any) {
    console.log('Error pedido =>', error.response?.data || error)
    advertencia.value = error.response?.data?.message || 'No se pudo confirmar el pedido'
  }
}
</script>

<template>
  <section class="checkout-wrapper">
    <div class="checkout-card">
      <header class="checkout-headline">
        <div class="icon-circle">🧾</div>
        <div>
          <p class="subtitle">Pasos finales</p>
          <h2 class="title">Confirma tu pedido</h2>
        </div>
      </header>

      <div v-if="advertencia" class="alerta">{{ advertencia }}</div>

      <div v-if="carrito.items.length" class="checkout-grid">
        <div class="resumen">
          <h3>Resumen del carrito</h3>
          <ul>
            <li v-for="item in carrito.items" :key="item.id">
              <div>
                <p class="producto">{{ item.nombre }}</p>
                <small>{{ item.cantidad }} × Bs {{ Number(item.precio).toFixed(2) }}</small>
              </div>
              <span class="precio">Bs {{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </li>
          </ul>
          <div class="total">
            <span>Total</span>
            <strong>Bs {{ carrito.total.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="formulario">
          <label class="campo">
            <span>Método de pago</span>
            <select v-model="metodoPago">
              <option value="qr">QR</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="efectivo">Efectivo</option>
            </select>
          </label>

          <div v-if="metodoPago === 'qr'" class="panel panel-qr">
            <img src="@/assets/images/qr_ejemplo.png" alt="QR de pago" />
            <p>Escanea el código para completar el pago.</p>
          </div>

          <div v-if="metodoPago === 'tarjeta'" class="panel panel-tarjeta">
            <input type="text" placeholder="Número de tarjeta" />
            <input type="text" placeholder="Nombre en la tarjeta" />
            <div class="fila">
              <input type="text" placeholder="MM/AA" />
              <input type="text" placeholder="CVV" />
            </div>
          </div>

          <div v-if="metodoPago === 'efectivo'" class="panel panel-efectivo">
            <p>Pagarás en efectivo al recibir tu pedido.</p>
          </div>

          <label class="campo">
            <span>Dirección de envío</span>
            <input v-model="direccionEnvio" type="text" placeholder="Ej. Av. Principal #123" />
          </label>

          <button class="btn-confirmar" @click="confirmarPedido">
            Confirmar pedido
          </button>
        </div>
      </div>

      <div v-else class="checkout-empty">
        <div class="empty-icon">🥤</div>
        <p>Tu carrito está vacío.</p>
        <router-link to="/" class="btn-volver">Volver al menú</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkout-wrapper {
  min-height: 100vh;
  padding: 120px 20px 60px;
  background:
    radial-gradient(circle at top, rgba(255, 190, 51, 0.2), transparent),
    #1d1f21;
  display: flex;
  justify-content: center;
}

.checkout-card {
  width: min(1100px, 100%);
  background: rgba(31, 34, 37, 0.92);
  border: 1px solid rgba(255, 190, 51, 0.2);
  border-radius: 28px;
  padding: 2.5rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
}

.checkout-headline {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-bottom: 2rem;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffbe33, #d72323);
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #1d1f21;
  box-shadow: 0 10px 25px rgba(215, 35, 35, 0.35);
}

.subtitle {
  color: #ffbe33;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.85rem;
  margin: 0;
}

.title {
  color: #fff6d9;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  margin: 0.2rem 0 0;
}

.alerta {
  background: rgba(215, 35, 35, 0.2);
  border: 1px solid rgba(215, 35, 35, 0.5);
  color: #ffb4b4;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  margin-bottom: 1.5rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.resumen,
.formulario {
  background: rgba(24, 26, 28, 0.7);
  border: 1px solid rgba(255, 190, 51, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

.resumen h3 {
  color: #ffbe33;
  margin-bottom: 1rem;
}

.resumen ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resumen li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(255, 190, 51, 0.2);
  padding: 0.8rem 0;
}

.resumen li:last-child {
  border-bottom: none;
}

.producto {
  color: #fff6d9;
  margin: 0;
}

.precio {
  color: #ffd666;
  font-weight: 600;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 190, 51, 0.2);
  color: #ffbe33;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  color: #fff6d9;
}

.campo select,
.campo input {
  background: #1f2225;
  border: 1px solid rgba(255, 190, 51, 0.3);
  border-radius: 12px;
  padding: 0.7rem 0.9rem;
  color: #fff6d9;
}

.panel {
  border-radius: 16px;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px dashed rgba(255, 190, 51, 0.3);
  background: rgba(25, 27, 29, 0.8);
  text-align: center;
  color: rgba(255, 246, 217, 0.8);
}

.panel-qr img {
  max-width: 180px;
  border-radius: 12px;
  margin-bottom: 0.6rem;
}

.panel-tarjeta input {
  width: 100%;
  margin-bottom: 0.6rem;
}

.panel-tarjeta .fila {
  display: flex;
  gap: 0.6rem;
}

.btn-confirmar {
  width: 100%;
  background: linear-gradient(135deg, #ffbe33, #d72323);
  border: none;
  border-radius: 999px;
  padding: 0.95rem;
  color: #1d1f21;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 12px 25px rgba(215, 35, 35, 0.35);
  transition: transform 0.2s;
}

.btn-confirmar:hover {
  transform: translateY(-2px);
}

.checkout-empty {
  text-align: center;
  padding: 3rem 0;
  color: rgba(255, 246, 217, 0.7);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn-volver {
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #ffbe33, #d72323);
  color: #1d1f21;
  padding: 0.9rem 1.6rem;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 12px 25px rgba(215, 35, 35, 0.35);
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
