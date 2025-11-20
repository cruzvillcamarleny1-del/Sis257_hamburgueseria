<script setup lang="ts">
import { defineProps, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const dtf = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'short',
  timeStyle: 'medium',
  hour12: false,
  timeZone: 'America/La_Paz',
})

function parseFecha(value: any): Date | null {
  if (!value) return null
  if (value instanceof Date) return value

  // "HH:mm:ss"
  if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
    const d = new Date()
    const [h, m, s] = value.split(':').map(Number)
    d.setHours(h, m, s, 0)
    return d
  }

  // "YYYY-MM-DD"
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + 'T00:00:00')
  }

  return new Date(value)
}

function formatFechaHora(value: unknown) {
  const d = parseFecha(value)
  return d && !isNaN(d.getTime()) ? dtf.format(d) : '—'
}

const props = defineProps<{
  mostrar: boolean
  venta: any
}>()

const emit = defineEmits(['close'])

const total = computed(() =>
  props.venta?.detalleVenta?.reduce((acc: number, d: any) => acc + Number(d.subtotal), 0),
)
</script>

<template>
  <div class="detalle-venta-container">
    <Dialog
      v-model:visible="props.mostrar"
      class="detalle-venta-dialog"
      :style="{ width: '40rem' }"
      modal
      :closable="false"
    >
      <template #header>
        <div class="dialog-header">
          <i class="pi pi-eye header-icon"></i>
          <h2 class="header-title">Detalle de Venta</h2>
          <p class="header-subtitle">Información detallada de la venta seleccionada</p>
        </div>
      </template>

      <div class="dialog-content">
        <!-- Información del cliente -->
        <div class="info-section">
          <div class="info-item">
            <label class="info-label"> <i class="pi pi-user info-icon"></i> Cliente: </label>
            <span class="info-value">
              {{ venta.cliente?.nombre || '' }}
              {{ venta.cliente?.apellido || '' }}
              <template v-if="venta.cliente?.ci">({{ venta.cliente.ci }})</template>
              <template v-else>(Sin CI)</template>
            </span>
          </div>
          <div class="info-item">
            <label class="info-label"> <i class="pi pi-user-edit info-icon"></i> Vendedor: </label>
            <span class="info-value">{{ venta.usuario?.usuario || 'Sin vendedor' }}</span>
          </div>
          <div class="info-item">
            <label class="info-label"> <i class="pi pi-calendar info-icon"></i> Fecha: </label>
            <span class="info-value">{{ formatFechaHora(venta.fecha) }}</span>
          </div>
        </div>

        <!-- Tabla de detalles -->
        <div class="detalle-table-wrapper">
          <table class="detalle-table">
            <thead>
              <tr>
                <th>Img</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in venta.detalleVenta" :key="idx">
                <td>
                  <img
                    v-if="item.producto?.imagen"
                    :src="item.producto.imagen"
                    alt="Imagen producto"
                    style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px"
                  />
                  <span v-else style="color: #aaa">Sin imagen</span>
                </td>
                <td>{{ item.producto?.nombre || 'N/A' }}</td>
                <td>{{ item.cantidad }}</td>
                <td>Bs {{ item.precioUnitario }}</td>
                <td>Bs {{ item.subtotal }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div class="total-section">
          <span class="total-label">Total:</span>
          <span class="total-value">Bs {{ total }}</span>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button label="Cerrar" icon="pi pi-times" class="btn-cerrar" @click="emit('close')" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style>
.detalle-venta-container {
  position: relative;
}

/* Estilo del Dialog */
.detalle-venta-dialog {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 193, 7, 0.2) !important;
  background: linear-gradient(135deg, #2c2f33 0%, #23272a 50%, #2c2f33 100%) !important;
}

.detalle-venta-dialog .p-dialog-header {
  background: linear-gradient(135deg, #23272a 0%, #2c2f33 100%) !important;
  padding: 1.5rem !important;
  border: none !important;
  color: #ffffff !important;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra horizontalmente */
  justify-content: center;
  text-align: center;
  width: 100%;
}

.header-icon {
  font-size: 2.5rem;
  color: #ffbe33;
  margin-bottom: 0.5rem;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.header-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
}

/* Contenido del dialog */
.dialog-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start; /* Antes: center */
  gap: 0.5rem;
}

.info-label {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
  display: flex;
  align-items: flex-start; /* Antes: center */
  gap: 0.5rem;
  min-width: 120px; /* Opcional: ancho fijo para alinear valores */
}

.info-icon {
  font-size: 1.2rem;
  color: #ffbe33;
}

.info-value {
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
  margin-top: 0.1rem; /* Opcional: pequeño ajuste vertical */
}

/* Tabla de detalles */
.detalle-table-wrapper {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detalle-table {
  width: 100%;
  border-collapse: collapse;
  background: #2c2f33;
}

.detalle-table th,
.detalle-table td {
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
}

.detalle-table th {
  background: linear-gradient(135deg, #ffbe33 0%, #ffa500 100%);
  color: #ffffff;
  font-weight: 700;
}

.detalle-table td {
  border-bottom: 1px solid #444;
  color: #ffffff;
}

/* Total */
.total-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}

.total-value {
  font-size: 1.5rem;
  color: #ff5722;
}

/* Footer */
.dialog-footer {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.btn-cerrar {
  background: linear-gradient(135deg, #ff5722, #ff7043) !important;
  border: none !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-cerrar:hover {
  background: linear-gradient(135deg, #ff7043, #ff5722) !important;
  box-shadow: 0 6px 20px rgba(255, 87, 34, 0.5) !important;
  transform: translateY(-2px) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .detalle-venta-dialog {
    width: 95vw !important;
  }

  .dialog-content {
    padding: 1.5rem;
  }

  .detalle-table th,
  .detalle-table td {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .total-section {
    font-size: 1rem;
  }

  .total-value {
    font-size: 1.2rem;
  }
}
</style>
