<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'

const pedidos = ref([])
const idCliente = Number(localStorage.getItem('id_cliente')) // ajusta según tu login

async function cargarPedidos() {
  const res = await http.get(`/pedidos/cliente/${idCliente}`)
  pedidos.value = res.data
}

onMounted(cargarPedidos)
</script>

<template>
  <div class="pedidos-cliente-container">
    <h2>Mis pedidos</h2>
    <div v-if="pedidos.length">
      <table>
        <thead>
          <tr>
            <th>N°</th>
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
            <td>{{ pedido.id }}</td>
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
      <p>No tienes pedidos registrados.</p>
    </div>
  </div>
</template>
