<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'

const pedidos = ref([])
const estado = ref('pendiente')

async function cargarPedidos() {
  const res = await http.get(`/pedidos/estado/${estado.value}`)
  pedidos.value = res.data
}

onMounted(cargarPedidos)
</script>

<template>
  <div class="pedidos-empleados-container">
    <h2>Gestión de pedidos</h2>
    <div>
      <label>Filtrar por estado:</label>
      <select v-model="estado" @change="cargarPedidos">
        <option value="pendiente">Pendiente</option>
        <option value="pagado">Pagado</option>
        <option value="enviado">Enviado</option>
        <option value="entregado">Entregado</option>
      </select>
    </div>
    <div v-if="pedidos.length">
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Método de pago</th>
            <th>Productos</th>
            <!-- AGREGA ESTA LÍNEA -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in pedidos" :key="pedido.id">
            <td>{{ pedido.cliente?.nombre }} {{ pedido.cliente?.apellido }}</td>
            <td>{{ pedido.id }}</td>
            <td>{{ pedido.idCliente }}</td>
            <td>{{ new Date(pedido.fecha).toLocaleString() }}</td>
            <td>{{ pedido.total }} Bs</td>
            <td>{{ pedido.estado }}</td>
            <td>{{ pedido.metodoPago }}</td>
            <td>
              <ul>
                <li v-for="detalle in pedido.detalles" :key="detalle.id">
                  {{ detalle.cantidad }} x {{ detalle.idProducto }} ({{
                    detalle.precioUnitario
                  }}
                  Bs)
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No hay pedidos en este estado.</p>
    </div>
  </div>
</template>
