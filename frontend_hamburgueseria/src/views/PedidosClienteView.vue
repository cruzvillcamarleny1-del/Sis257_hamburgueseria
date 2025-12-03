<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import http from '@/plugins/axios'

const pedidos = ref<any[]>([])
const loading = ref(true)
const advertencia = ref('')
const productosCache = ref<Record<number, { nombre: string; imagen?: string }>>({})

async function cargarProductos(ids: number[]) {
  const faltantes = ids.filter((id) => !productosCache.value[id])
  if (!faltantes.length) return

  await Promise.all(
    faltantes.map(async (id) => {
      try {
        const { data } = await http.get(`/productos/${id}`)
        productosCache.value[id] = {
          nombre: data?.nombre || `Producto #${id}`,
          imagen: data?.imagen || data?.imagenUrl || data?.foto,
        }
      } catch {
        productosCache.value[id] = { nombre: `Producto #${id}` }
      }
    }),
  )
}

function infoProducto(id: number) {
  return productosCache.value[id]
}

async function cargarPedidos() {
  const idCliente = Number(localStorage.getItem('id_cliente'))
  if (!idCliente) {
    advertencia.value = 'Inicia sesión para ver tus pedidos.'
    loading.value = false
    router.push('/login-cliente')
    return
  }

  try {
    const { data } = await http.get(`/pedidos/cliente/${idCliente}`)
    pedidos.value = Array.isArray(data) ? data : []

    const idsProductos = Array.from(
      new Set(
        pedidos.value.flatMap((pedido) =>
          (pedido.detalles || []).map((detalle: any) => Number(detalle.idProducto)),
        ),
      ),
    ).filter(Boolean)

    await cargarProductos(idsProductos)
  } catch (error: any) {
    advertencia.value = error?.response?.data?.message || 'No se pudieron cargar tus pedidos.'
    if (error?.response?.status === 401) router.push('/login-cliente')
  } finally {
    loading.value = false
  }
}

onMounted(cargarPedidos)
</script>

<template>
  <section class="pedidos-wrapper">
    <div class="pedidos-card">
      <header class="pedidos-headline">
        <div class="icon-circle">🍔</div>
        <div>
          <p class="subtitle">Historial de pedidos</p>
          <h2 class="title">Tus antojos recientes</h2>
        </div>
      </header>

      <p v-if="advertencia" class="alerta">{{ advertencia }}</p>
      <p v-else-if="loading" class="alerta">Cargando tus pedidos...</p>

      <div v-else-if="pedidos.length" class="pedidos-list">
        <article v-for="pedido in pedidos" :key="pedido.id" class="pedido-item">
          <div class="pedido-header">
            <div>
              <p class="pedido-id">Pedido #{{ pedido.id }}</p>
              <p class="pedido-fecha">
                {{ new Date(pedido.fecha).toLocaleString() }}
              </p>
            </div>
            <span class="estado" :data-estado="pedido.estado">
              {{ pedido.estado?.toUpperCase() }}
            </span>
          </div>

          <div class="pedido-body">
            <div class="pedido-info">
              <p><strong>Total:</strong> Bs {{ Number(pedido.total).toFixed(2) }}</p>
              <p><strong>Método:</strong> {{ pedido.metodoPago }}</p>
              <p v-if="pedido.direccionEnvio">
                <strong>Entrega:</strong> {{ pedido.direccionEnvio }}
              </p>
            </div>

            <div class="pedido-detalles">
              <p class="detalle-title">Productos</p>
              <ul>
                <li v-for="detalle in pedido.detalles" :key="detalle.id" class="detalle-item">
                  <div class="detalle-info">
                    <img
                      v-if="infoProducto(detalle.idProducto)?.imagen"
                      :src="infoProducto(detalle.idProducto)?.imagen"
                      alt="Producto"
                    />
                    <div>
                      <span class="producto">
                        {{
                          infoProducto(detalle.idProducto)?.nombre ||
                          `Producto #${detalle.idProducto}`
                        }}
                      </span>
                    </div>
                  </div>
                  <span class="cantidad">{{ detalle.cantidad }}x</span>
                  <span class="precio"> Bs {{ Number(detalle.precioUnitario).toFixed(2) }} </span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="pedidos-empty">
        <div class="empty-icon">🍟</div>
        <p>Aún no registras pedidos.</p>
        <router-link to="/" class="btn-volver">Explorar menú</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pedidos-wrapper {
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: radial-gradient(circle at top, rgba(255, 190, 51, 0.2), transparent), #1d1f21;
  display: flex;
  justify-content: center;
}

.pedidos-card {
  width: min(1100px, 100%);
  background: rgba(31, 34, 37, 0.9);
  border: 1px solid rgba(255, 190, 51, 0.2);
  border-radius: 28px;
  padding: 2.5rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
}

.pedidos-headline {
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
  color: #fed564;
  margin-bottom: 1rem;
}

.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.pedido-item {
  border: 1px solid rgba(255, 190, 51, 0.15);
  border-radius: 20px;
  padding: 1.5rem;
  background: linear-gradient(140deg, rgba(42, 46, 50, 0.95), rgba(25, 27, 29, 0.95));
  box-shadow: 0 12px 35px -12px rgba(0, 0, 0, 0.6);
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pedido-id {
  color: #fed564;
  margin: 0;
}

.pedido-fecha {
  color: rgba(255, 246, 217, 0.7);
  font-size: 0.85rem;
  margin: 0.2rem 0 0;
}

.estado {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: #1d1f21;
  font-weight: 700;
  background: #ffbe33;
}
.estado[data-estado='pagado'] {
  background: #3fa34d;
  color: #fff;
}
.estado[data-estado='pendiente'] {
  background: #ffbe33;
}
.estado[data-estado='cancelado'] {
  background: #d72323;
  color: #fff;
}

.pedido-body {
  margin-top: 1.4rem;
  display: grid;
  gap: 1.2rem;
}

.pedido-info p {
  margin: 0.2rem 0;
  color: #fff6d9;
}

.pedido-detalles {
  border-top: 1px solid rgba(255, 190, 51, 0.2);
  padding-top: 1rem;
}

.detalle-title {
  color: #fed564;
  letter-spacing: 1px;
  margin-bottom: 0.4rem;
}

.pedido-detalles ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pedido-detalles li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 246, 217, 0.8);
  padding: 0.45rem 0;
  border-bottom: 1px dashed rgba(255, 190, 51, 0.2);
}
.pedido-detalles li:last-child {
  border-bottom: none;
}

.cantidad {
  color: #ffbe33;
  font-weight: 700;
  justify-self: center;
  text-align: center;
  min-width: 40px;
}

.precio {
  color: #fed564;
  font-weight: 600;
}

.pedidos-empty {
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

.detalle-item {
  display: grid;
  grid-template-columns: 2fr auto auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0;
  border-bottom: 1px dashed rgba(255, 190, 51, 0.2);
}
.detalle-item:last-child {
  border-bottom: none;
}
.detalle-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.detalle-info img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(255, 190, 51, 0.3);
  background: #2a2e32;
}
.detalle-info small {
  color: rgba(255, 246, 217, 0.5);
  font-size: 0.7rem;
}
.producto {
  display: block;
  color: #fff6d9;
  font-weight: 600;
}

@media (max-width: 768px) {
  .pedidos-card {
    padding: 1.5rem;
  }
  .pedido-item {
    padding: 1rem;
  }
}
</style>
