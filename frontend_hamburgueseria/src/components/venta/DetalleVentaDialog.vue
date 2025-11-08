<script setup lang="ts">
import { defineProps, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

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
  <Dialog
    v-model:visible="props.mostrar"
    header="Detalle de Venta"
    class="producto-dialog"
    :style="{ width: '38rem' }"
    modal
    :closable="false"
  >
    <template #header>
      <div class="dialog-header-custom">
        <div class="header-icon">
          <i class="pi pi-eye"></i>
        </div>
        <h3 class="header-title">Detalle de Venta</h3>
      </div>
    </template>

    <div v-if="venta" class="dialog-content">
      <div class="info-row">
        <div class="info-label"><i class="pi pi-user"></i> Cliente:</div>
        <div class="info-value">{{ venta.cliente?.nombre || '-' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label"><i class="pi pi-user-edit"></i> Vendedor:</div>
        <div class="info-value">{{ venta.usuario?.usuario || '-' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label"><i class="pi pi-calendar"></i> Fecha:</div>
        <div class="info-value">{{ venta.fecha }}</div>
      </div>

      <div class="detalle-table-wrapper">
        <table class="detalle-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in venta.detalleVenta" :key="idx">
              <td>{{ item.producto?.nombre || '-' }}</td>
              <td>{{ item.cantidad }}</td>
              <td>Bs {{ item.precioUnitario }}</td>
              <td>Bs {{ item.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="total-venta">
        <span>Total:</span>
        <span class="total-monto">Bs {{ total }}</span>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer-custom">
        <Button label="Cerrar" icon="pi pi-times" class="btn-cancelar" @click="emit('close')" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.producto-dialog {
  border-radius: 25px !important;
  overflow: hidden !important;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 107, 53, 0.1) !important;
  background: linear-gradient(135deg, #fff 0%, #fefefe 100%) !important;
}

:deep(.producto-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%) !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

:deep(.producto-dialog .p-dialog-content) {
  padding: 2rem !important;
  background: linear-gradient(135deg, #fff 0%, #fefefe 100%) !important;
}

:deep(.producto-dialog .p-dialog-footer) {
  background: linear-gradient(135deg, #fff 0%, #fefefe 100%) !important;
  border: none !important;
  padding: 1.5rem 2rem !important;
  border-top: 1px solid rgba(255, 107, 53, 0.1) !important;
}

.dialog-header-custom {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
  color: white;
  width: 100%;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
}

.info-label {
  font-weight: 700;
  color: #ff6b35;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-value {
  color: #ffffff;
  font-weight: 500;
}

.detalle-table-wrapper {
  margin-top: 1rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(255, 107, 53, 0.07);
}

.detalle-table {
  width: 100%;
  border-collapse: collapse;
  background: rgb(2, 2, 2);
}

.detalle-table th,
.detalle-table td {
  padding: 0.7rem 0.5rem;
  text-align: center;
  font-size: 1rem;
}

.detalle-table th {
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  font-weight: 700;
  border-bottom: 2px solid #ff8c42;
}

.detalle-table td {
  border-bottom: 1px solid #f3f3f3;
}

.total-venta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  color: #ff6b35;
}

.total-monto {
  font-size: 1.5rem;
  color: #ff8c42;
}

.dialog-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;
}

.btn-cancelar {
  background: transparent !important;
  border: 2px solid #ddd !important;
  color: #666 !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  font-size: 0.95rem !important;
}

.btn-cancelar:hover {
  border-color: #ff6b35 !important;
  color: #ff6b35 !important;
  background: rgba(255, 107, 53, 0.05) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  :deep(.producto-dialog) {
    width: 98vw !important;
    max-width: 98vw !important;
  }
  .dialog-header-custom {
    padding: 1rem 1.5rem !important;
  }
  .header-icon {
    width: 40px !important;
    height: 40px !important;
    font-size: 1.2rem !important;
  }
  .header-title {
    font-size: 1.2rem !important;
  }
  :deep(.producto-dialog .p-dialog-content) {
    padding: 1.5rem !important;
  }
  :deep(.producto-dialog .p-dialog-footer) {
    padding: 1rem 1.5rem !important;
  }
  .dialog-footer-custom {
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
  .btn-cancelar {
    width: 100% !important;
    justify-content: center !important;
  }
  .detalle-table th,
  .detalle-table td {
    font-size: 0.9rem;
    padding: 0.5rem 0.2rem;
  }
  .total-venta {
    font-size: 1rem;
  }
  .total-monto {
    font-size: 1.2rem;
  }
}
</style>
