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
    <!-- Header con diseño atractivo -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <i class="pi pi-shopping-bag header-icon"></i>
          <h1 class="main-title">Ventas</h1>
          <p class="subtitle">Gestiona las ventas de tu hamburguesería</p>
        </div>
        <div class="action-wrapper">
          <Button
            label="Nueva Venta"
            icon="pi pi-plus"
            @click="mostrarFormulario = true"
            class="create-button"
            size="large"
          />
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="content-card">
        <template v-if="ventas.length">
          <div class="tabla-ventas-container">
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
                <template #header>
                  <div class="header-acciones"><i class="pi pi-cog"></i></div>
                </template>
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

              <Column field="id" header="N°Venta">
                <template #header>
                  <div class="header-id"><i class="pi pi-hashtag"></i></div>
                </template>
                <template #body="slotProps">
                  <div class="id-badge">
                    <span>#{{ slotProps.data.id }}</span>
                  </div>
                </template>
              </Column>

              <Column field="fecha" header="Fecha">
                <template #header>
                  <div class="header-fecha"><i class="pi pi-calendar"></i></div>
                </template>
                <template #body="slotProps">
                  <div class="fecha-container">
                    <i class="pi pi-calendar fecha-icon"></i>
                    <span>{{ slotProps.data.fecha }}</span>
                  </div>
                </template>
              </Column>

              <Column field="total" header="Total">
                <template #header>
                  <div class="header-total"><i class="pi pi-wallet"></i></div>
                </template>
                <template #body="slotProps">
                  <div class="total-badge">
                    <i class="pi pi-wallet total-icon"></i>
                    <span>{{ slotProps.data.total }} Bs.</span>
                  </div>
                </template>
              </Column>

              <Column field="cliente.nombre" header="Cliente">
                <template #header>
                  <div class="header-cliente"><i class="pi pi-user"></i></div>
                </template>
                <template #body="slotProps">
                  <div class="cliente-info">
                    <i class="pi pi-user cliente-icon"></i>
                    <span>{{ slotProps.data.cliente?.nombre || 'Sin cliente' }}</span>
                  </div>
                </template>
              </Column>

              <Column field="usuario.usuario" header="Vendedor">
                <template #header>
                  <div class="header-vendedor"><i class="pi pi-user-edit"></i></div>
                </template>
                <template #body="slotProps">
                  <div class="usuario-badge">
                    <i class="pi pi-user-edit vendedor-icon"></i>
                    <span>{{ slotProps.data.usuario?.usuario || 'Sin usuario' }}</span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>

        <template v-else>
          <div class="estado-vacio">
            <div class="vacio-content">
              <i class="pi pi-shopping-cart vacio-icon"></i>
              <h3>No hay ventas registradas</h3>
              <p>Comienza registrando tu primera venta</p>
              <Button
                label="Registrar Primera Venta"
                icon="pi pi-plus"
                @click="mostrarFormulario = true"
                class="create-button"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Formulario de venta -->
    <VentaForm
      :mostrar="mostrarFormulario"
      @cerrar="mostrarFormulario = false"
      @ventaGuardada="cargarVentas"
    />
    <!-- Detalle -->
    <DetalleVentaDialog
      :mostrar="mostrarDetalle"
      :venta="ventaSeleccionada"
      @close="mostrarDetalle = false"
    />

    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <div class="burger-icon icon-1">🍔</div>
      <div class="burger-icon icon-2">🍟</div>
      <div class="burger-icon icon-3">🥤</div>
    </div>
  </div>
</template>

<style scoped>
.ventas-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #222831 0%,
    #393e46 25%,
    #222831 50%,
    #393e46 75%,
    #222831 100%
  );
  position: relative;
  overflow-x: hidden;
}

.ventas-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.header-section {
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 2;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.title-wrapper {
  flex: 1;
  min-width: 300px;
}

.header-icon {
  font-size: 2.5rem;
  color: #ffbe33;
  margin-bottom: 1rem;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  color: #eeeeee;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 190, 51, 0.9);
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.action-wrapper {
  flex-shrink: 0;
}

.create-button {
  background: linear-gradient(45deg, #ffbe33 0%, #ffa500 100%) !important;
  border: none !important;
  color: #222831 !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  padding: 1rem 2rem !important;
  border-radius: 50px !important;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.3),
    0 4px 10px rgba(255, 190, 51, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-button:hover {
  transform: translateY(-3px) !important;
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.4),
    0 6px 15px rgba(255, 190, 51, 0.6) !important;
  background: linear-gradient(45deg, #ffa500 0%, #ffbe33 100%) !important;
}

.create-button:active {
  transform: translateY(-1px) !important;
}

.main-content {
  padding: 0 1.5rem 2rem;
  position: relative;
  z-index: 2;
}

.content-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(238, 238, 238, 0.98);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 8px 20px rgba(255, 190, 51, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 190, 51, 0.2);
  overflow: hidden;
  position: relative;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffbe33 0%, #ffa500 50%, #ffbe33 100%);
}

.content-card-inner {
  padding: 1rem 1rem 1.5rem;
}

.estado-vacio {
  padding: 3rem 2rem;
  text-align: center;
  color: #131313;
}

.vacio-icon {
  font-size: 3rem;
  color: #ffbe33;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

/* Decoración de fondo */
.background-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.burger-icon {
  position: absolute;
  font-size: 4rem;
  opacity: 0.5;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(2px 2px 8px rgba(255, 190, 51, 0.5));
  text-shadow: 0 0 20px rgba(255, 190, 51, 0.6);
}

.icon-1 {
  top: 20%;
  left: 2%;
  animation-delay: 0s;
}
.icon-2 {
  top: 60%;
  right: 2%;
  animation-delay: 2s;
  font-size: 3rem;
}
.icon-3 {
  bottom: 1%;
  left: 5%;
  animation-delay: 4s;
  font-size: 5rem;
}

.tabla-ventas-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.tabla-ventas-container .tabla-ventas {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  position: relative;
}

.tabla-ventas-container .tabla-ventas thead {
  background: linear-gradient(135deg, #393e46 0%, #222831 100%);
  color: white;
}

.tabla-ventas-container .tabla-ventas thead th {
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #eeeeee;
  padding: 1rem;
  background: linear-gradient(135deg, #222831 0%, #393e46 100%);
  border: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.tabla-ventas-container .tabla-ventas thead th .pi {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #ffbe33;
}

.tabla-ventas-container .tabla-ventas tbody tr {
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(57, 62, 70, 0.1);
}

.tabla-ventas-container .tabla-ventas tbody tr:hover {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 235, 59, 0.12) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(255, 215, 0, 0.25);
}

.tabla-ventas-container .tabla-ventas tbody td {
  padding: 1.2rem 1rem;
  text-align: center;
  vertical-align: middle;
  border: none;
}

.tabla-ventas-container .id-badge,
.tabla-ventas-container .total-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%);
  color: #1a1a2e;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.tabla-ventas-container .fecha-container,
.tabla-ventas-container .cliente-info,
.tabla-ventas-container .usuario-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6f6f6f;
}

.tabla-ventas-container .btn-detalle {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  padding: 0.6rem 1rem !important;
  border-radius: 25px !important;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3) !important;
  transition: all 0.3s ease !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tabla-ventas-container .btn-detalle i {
  font-size: 1.2rem;
}

.tabla-ventas-container .btn-detalle:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5) !important;
  background: linear-gradient(135deg, #66bb6a, #4caf50) !important;
}

.tabla-ventas-container .btn-detalle:active {
  transform: translateY(0) !important;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3) !important;
}

/* Estilo para el ID */
.id-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%);
  color: #1a1a2e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  display: inline-block;
  text-align: center;
}

/* Estilo para la fecha */
.fecha-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #7d7d7d;
}

.fecha-icon {
  font-size: 1.2rem;
  color: #4caf50;
}

/* Estilo para el total */
.total-badge {
  background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-icon {
  font-size: 1.2rem;
}

/* Estilo para el cliente */
.cliente-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6d6a6a;
}

.cliente-icon {
  font-size: 1.2rem;
  color: #2196f3;
}

/* Estilo para el vendedor */
.usuario-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #757575;
}

.vendedor-icon {
  font-size: 1.2rem;
  color: #9c27b0;
}



@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Animaciones entrada */
@keyframes slideInFromTop {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  animation: slideInFromTop 0.8s ease-out;
}
.content-card {
  animation: slideInFromBottom 0.8s ease-out 0.2s both;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  .title-wrapper {
    min-width: auto;
  }
  .main-title {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .create-button {
    font-size: 1rem !important;
    padding: 0.8rem 1.5rem !important;
  }
  .burger-icon {
    font-size: 2.5rem;
  }
  .icon-3 {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 1.5rem 1rem;
  }
  .main-content {
    padding: 0 1rem 1.5rem;
  }
  .main-title {
    font-size: 1.8rem;
  }
  .content-card {
    border-radius: 15px;
  }
}
</style>
