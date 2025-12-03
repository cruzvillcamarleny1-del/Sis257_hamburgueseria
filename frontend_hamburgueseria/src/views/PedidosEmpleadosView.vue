<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import http from '@/plugins/axios'

const pedidos = ref<any[]>([])
const estado = ref('pendiente')
const loading = ref(false)
const mensaje = ref('')

const estados = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Pagado', value: 'pagado' },
  { label: 'Enviado', value: 'enviado' },
  { label: 'Entregado', value: 'entregado' },
  { label: 'Cancelado', value: 'cancelado' },
]
const productosCache = ref<Record<number, string>>({})

const selectedEstados = ref<Record<number, string>>({})

async function actualizarEstado(pedidoId: number) {
  const nuevoEstado = selectedEstados.value[pedidoId]
  if (!nuevoEstado || nuevoEstado === '') return
  try {
    await http.patch(`/pedidos/${pedidoId}/estado`, { estado: nuevoEstado })
    await cargarPedidos()
  } catch (error: any) {
    mensaje.value = error?.response?.data?.message || 'No se pudo actualizar el estado.'
  }
}

function nombreProducto(id: number) {
  return productosCache.value[id] || `Producto #${id}`
}

async function cargarProductosDePedidos(lista: any[]) {
  const faltantes = new Set<number>()
  lista.forEach((pedido) => {
    ;(pedido.detalles || []).forEach((detalle: any) => {
      if (!productosCache.value[detalle.idProducto]) {
        faltantes.add(detalle.idProducto)
      }
    })
  })

  await Promise.all(
    Array.from(faltantes).map(async (id) => {
      try {
        const { data } = await http.get(`/productos/${id}`)
        productosCache.value[id] = data?.nombre || `Producto #${id}`
      } catch {
        productosCache.value[id] = `Producto #${id}`
      }
    }),
  )
}

async function cargarPedidos() {
  loading.value = true
  mensaje.value = ''
  try {
    const { data } = await http.get(`/pedidos/estado/${estado.value}`)
    pedidos.value = Array.isArray(data) ? data : []
    await cargarProductosDePedidos(pedidos.value)
    pedidos.value.forEach((pedido) => {
      selectedEstados.value[pedido.id] = pedido.estado
    })
    if (!pedidos.value.length) mensaje.value = 'No hay pedidos en este estado.'
  } catch (error: any) {
    mensaje.value = error?.response?.data?.message || 'No se pudieron cargar los pedidos.'
  } finally {
    loading.value = false
  }
}

const totalPedidos = computed(() => pedidos.value.length)
const totalImporte = computed(() =>
  pedidos.value.reduce((acc, pedido) => acc + Number(pedido.total || 0), 0).toFixed(2),
)

onMounted(cargarPedidos)
</script>

<template>
  <section class="pedidos-admin-wrapper">
    <div class="pedidos-admin-card">
      <header class="header">
        <div class="icon-circle">📋</div>
        <div>
          <p class="subtitle">Panel interno</p>
          <h2 class="title">Gestión de pedidos</h2>
        </div>
      </header>

      <div class="stats">
        <div class="stat-box">
          <span>Total pedidos</span>
          <strong>{{ totalPedidos }}</strong>
        </div>
        <div class="stat-box">
          <span>Importe acumulado</span>
          <strong>Bs {{ totalImporte }}</strong>
        </div>
        <div class="stat-box selector">
          <span>Filtrar estado</span>
          <select v-model="estado" @change="cargarPedidos">
            <option v-for="opt in estados" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="mensaje" class="alerta">{{ mensaje }}</div>
      <div v-else-if="loading" class="alerta">Cargando pedidos...</div>

      <div v-else class="tabla-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Método</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in pedidos" :key="pedido.id">
              <td>{{ pedido.id }}</td>
              <td>{{ pedido.cliente?.nombre || '' }} {{ pedido.cliente?.apellido || '' }}</td>
              <td>{{ new Date(pedido.fecha).toLocaleString() }}</td>
              <td>Bs {{ Number(pedido.total).toFixed(2) }}</td>
              <td>
                <div class="estado-editor">
                  <span class="badge" :data-estado="pedido.estado">{{ pedido.estado }}</span>
                  <select v-model="selectedEstados[pedido.id]">
                    <option v-for="opt in estados" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                  <button @click="actualizarEstado(pedido.id)">Guardar</button>
                </div>
              </td>
              <td>{{ pedido.metodoPago }}</td>
              <td>
                <ul>
                  <li v-for="detalle in pedido.detalles" :key="detalle.id">
                    {{ detalle.cantidad }} × {{ nombreProducto(detalle.idProducto) }}
                    (Bs {{ Number(detalle.precioUnitario).toFixed(2) }})
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pedidos-admin-wrapper {
  min-height: 100vh;
  padding: 120px 20px 60px;
  background: radial-gradient(circle at top, rgba(255, 190, 51, 0.2), transparent), #1d1f21;
  display: flex;
  justify-content: center;
}
.pedidos-admin-card {
  width: min(1200px, 100%);
  background: rgba(31, 34, 37, 0.92);
  border: 1px solid rgba(255, 190, 51, 0.2);
  border-radius: 28px;
  padding: 2.5rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
}
.header {
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
}
.subtitle {
  color: #ffbe33;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}
.title {
  color: #fff6d9;
  margin: 0.2rem 0 0;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-box {
  border-radius: 18px;
  padding: 1.1rem;
  background: rgba(24, 26, 28, 0.8);
  border: 1px solid rgba(255, 190, 51, 0.15);
  color: #fff6d9;
}
.stat-box strong {
  display: block;
  margin-top: 0.4rem;
  font-size: 1.4rem;
  color: #ffbe33;
}
.selector select {
  width: 100%;
  margin-top: 0.5rem;
  background: #1d1f21;
  border: 1px solid rgba(255, 190, 51, 0.3);
  color: #fff6d9;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
}
.alerta {
  background: rgba(255, 190, 51, 0.15);
  border: 1px solid rgba(255, 190, 51, 0.35);
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  color: #ffd666;
}
.tabla-wrapper {
  margin-top: 1rem;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  color: #fff6d9;
  font-size: 0.9rem;
}
th,
td {
  padding: 0.85rem;
  border-bottom: 1px solid rgba(255, 190, 51, 0.12);
  text-align: left;
}
th {
  color: #ffbe33;
  font-weight: 600;
}
tbody tr:hover {
  background: rgba(255, 190, 51, 0.05);
}
td ul {
  padding-left: 1rem;
  margin: 0;
}
td ul li {
  color: rgba(255, 246, 217, 0.75);
}
.badge {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1d1f21;
  background: #ffbe33;
}
.badge[data-estado='enviado'],
.badge[data-estado='entregado'] {
  background: #3fa34d;
  color: #fff;
}
.badge[data-estado='cancelado'] {
  background: #d72323;
  color: #fff;
}
@media (max-width: 900px) {
  .pedidos-admin-card {
    padding: 1.5rem;
  }
  table {
    font-size: 0.8rem;
  }
}
.estado-editor {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.estado-editor select {
  background: #1d1f21;
  border: 1px solid rgba(255, 190, 51, 0.3);
  color: #fff6d9;
  border-radius: 10px;
  padding: 0.3rem 0.6rem;
}
.estado-editor button {
  background: linear-gradient(135deg, #ffbe33, #d72323);
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.75rem;
  color: #1d1f21;
  font-weight: 700;
  cursor: pointer;
}
</style>
