<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import VentaForm from '@/components/venta/VentaForm.vue'
import type { Venta } from '@/models/venta'

import DetalleVentaDialog from '@/components/venta/DetalleVentaDialog.vue'

const ventas = ref<Venta[]>([])
const mostrarFormulario = ref(false)

const mostrarDetalle = ref(false)
const ventaSeleccionada = ref<Venta | null>(null)

async function cargarVentas() {
  try {
    const response = await http.get('/ventas')
    ventas.value = response.data
  } catch (error) {
    console.error('Error al cargar ventas:', error)
  }
}

onMounted(cargarVentas)
</script>

<template>
  <div class="ventas-container">
    <!-- Header con gradiente -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="titulo-principal">
          <i class="pi pi-chart-line"></i>
          Registro de Ventas
        </h1>
        <p class="subtitulo">Gestiona las ventas de tu pizzería</p>
      </div>

      <Button
        label="Nueva Venta"
        icon="pi pi-plus"
        @click="mostrarFormulario = true"
        class="boton-nuevo"
        severity="warning"
      />
    </div>

    <!-- Mostrar formulario -->
    <VentaForm
      :mostrar="mostrarFormulario"
      @cerrar="mostrarFormulario = false"
      @venta-registrada="cargarVentas"
    />

    <!-- Tabla de ventas con diseño personalizado -->
    <div class="tabla-container" v-if="ventas.length">
      <div class="tabla-header">
        <h2>
          <i class="pi pi-list"></i>
          Historial de Ventas
        </h2>
        <div class="stats-badge">{{ ventas.length }} ventas registradas</div>
      </div>

      <DataTable
        :value="ventas"
        class="tabla-ventas"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column header="Acciones">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              label="Detalle"
              class="btn-detalle"
              @click="
                () => {
                  ventaSeleccionada = slotProps.data as Venta
                  mostrarDetalle = true
                }
              "
              severity="info"
              rounded
            />
          </template>
        </Column>

        <Column field="id" header="ID" class="columna-id">
          <template #body="slotProps">
            <div class="id-badge">#{{ slotProps.data.id }}</div>
          </template>
        </Column>

        <Column field="fecha" header="Fecha" class="columna-fecha">
          <template #body="slotProps">
            <div class="fecha-container">
              <i class="pi pi-calendar"></i>
              {{ slotProps.data.fecha }}
            </div>
          </template>
        </Column>

        <Column field="total" header="Total" class="columna-total">
          <template #body="slotProps">
            <div class="total-badge">{{ slotProps.data.total }} Bs.</div>
          </template>
        </Column>

        <Column field="cliente.nombre" header="Cliente" class="columna-cliente">
          <template #body="slotProps">
            <div class="cliente-info">
              <i class="pi pi-user"></i>
              {{ slotProps.data.cliente?.nombre || 'Sin cliente' }}
            </div>
          </template>
        </Column>

        <Column field="usuario.usuario" header="Vendedor" class="columna-usuario">
          <template #body="slotProps">
            <div class="usuario-badge">
              <i class="pi pi-user-edit"></i>
              {{ slotProps.data.usuario?.usuario || 'Sin usuario' }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Estado vacío -->
    <div v-else class="estado-vacio">
      <div class="vacio-content">
        <i class="pi pi-shopping-cart vacio-icon"></i>
        <h3>No hay ventas registradas</h3>
        <p>Comienza registrando tu primera venta</p>
        <Button
          label="Registrar Primera Venta"
          icon="pi pi-plus"
          @click="mostrarFormulario = true"
          class="boton-primera-venta"
        />
      </div>
    </div>
  </div>

  <DetalleVentaDialog
    :mostrar="mostrarDetalle"
    :venta="ventaSeleccionada"
    @close="mostrarDetalle = false"
  />
</template>

<style scoped>
.ventas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%);
  padding: 2rem;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-content {
  color: white;
}

.titulo-principal {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitulo {
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.boton-nuevo {
  background: white !important;
  color: #ff6b35 !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-weight: bold !important;
  border-radius: 50px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.boton-nuevo:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
}

/* Tabla Container */
.tabla-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.tabla-header {
  background: linear-gradient(90deg, #ff8c42 0%, #ff6b35 100%);
  padding: 1.5rem 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tabla-header h2 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Tabla personalizada */
:deep(.tabla-ventas) {
  border: none;
}

:deep(.tabla-ventas .p-datatable-thead > tr > th) {
  background: #fff5f0 !important;
  border: none !important;
  color: #ff6b35 !important;
  font-weight: bold !important;
  padding: 1rem !important;
}

:deep(.tabla-ventas .p-datatable-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.tabla-ventas .p-datatable-tbody > tr:hover) {
  background: #fff5f0 !important;
  transform: scale(1.02);
}

:deep(.tabla-ventas .p-datatable-tbody > tr > td) {
  border: none !important;
  padding: 1rem !important;
}

/* Badges y elementos personalizados */
.id-badge {
  background: linear-gradient(135deg, #ff6b35, #ff8c42);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-block;
}

.fecha-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000000;
}

.fecha-container i {
  color: #ff6b35;
}

.total-badge {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-weight: bold;
  display: inline-block;
}

.cliente-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
}

.cliente-info i {
  color: #ff6b35;
}

.usuario-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}

/* Estado vacío */
.estado-vacio {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.vacio-content {
  text-align: center;
  color: #666;
}

.vacio-icon {
  font-size: 4rem;
  color: #ff6b35;
  margin-bottom: 1rem;
}

.vacio-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.vacio-content p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.boton-primera-venta {
  background: linear-gradient(135deg, #ff6b35, #ff8c42) !important;
  border: none !important;
  color: white !important;
  padding: 1rem 2rem !important;
  border-radius: 50px !important;
  font-weight: bold !important;
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3) !important;
  transition: all 0.3s ease !important;
}

.boton-primera-venta:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .ventas-container {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .titulo-principal {
    font-size: 2rem;
  }

  .tabla-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tabla-container {
  animation: fadeInUp 0.6s ease-out;
}

.header-section {
  animation: fadeInUp 0.4s ease-out;
}
</style>
