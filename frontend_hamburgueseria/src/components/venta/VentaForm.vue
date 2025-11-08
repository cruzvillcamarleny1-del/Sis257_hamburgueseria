<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import type { Cliente } from '@/models/cliente'
import type { Usuario } from '@/models/usuario'

const props = defineProps<{ mostrar: boolean }>()
const emit = defineEmits(['cerrar', 'ventaGuardada'])

const usuarios = ref<Usuario[]>([])
const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])

const idUsuario = ref<number>()
const idCliente = ref<number>()
const productoSeleccionado = ref<Producto | null>(null)
const cantidad = ref(1)

const detalle = ref<
  { producto: Producto; cantidad: number; precioUnitario: number; subtotal: number }[]
>([])

const total = computed(() => detalle.value.reduce((acc, item) => acc + item.subtotal, 0))

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (val) => {
    if (!val) emit('cerrar')
  },
})

watch(
  () => props.mostrar,
  (nuevo) => {
    if (nuevo) {
      cargarDatos()
    }
  },
)

function cargarDatos() {
  Promise.all([http.get('/usuarios'), http.get('/clientes'), http.get('/productos')]).then(
    ([u, c, p]) => {
      usuarios.value = u.data
      clientes.value = c.data
      productos.value = p.data
    },
  )
  limpiarFormulario()
}

function limpiarFormulario() {
  idUsuario.value = undefined
  idCliente.value = undefined
  productoSeleccionado.value = null
  cantidad.value = 1
  detalle.value = []
}

const agregarProducto = () => {
  if (!productoSeleccionado.value) {
    alert('Debe seleccionar un producto')
    return
  }

  const yaExiste = detalle.value.find((item) => item.producto.id === productoSeleccionado.value!.id)
  if (yaExiste) {
    alert('Este producto ya fue agregado')
    return
  }

  detalle.value.push({
    producto: productoSeleccionado.value,
    cantidad: cantidad.value,
    precioUnitario: Number(productoSeleccionado.value.precio),
    subtotal: cantidad.value * Number(productoSeleccionado.value.precio),
  })

  productoSeleccionado.value = null
  cantidad.value = 1
}

async function registrarVenta() {
  if (!idUsuario.value || !idCliente.value || detalle.value.length === 0) {
    alert('Debe completar todos los campos y agregar al menos un producto')
    return
  }

  const venta = {
    idUsuario: idUsuario.value,
    idCliente: idCliente.value,
    fecha: new Date().toISOString(),
    total: total.value,
    detalleVenta: detalle.value.map((d) => ({
      idProducto: d.producto.id,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.subtotal,
    })),
  }

  try {
    await http.post('/ventas', venta)
    emit('ventaGuardada')
    emit('cerrar')
    limpiarFormulario()
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Ocurrió un error al registrar la venta')
  }
}
</script>

<template>
  <div class="dialog-container">
    <Dialog
      v-model:visible="dialogVisible"
      header="Registrar Nueva Venta"
      class="producto-dialog"
      :style="{ width: '40rem' }"
      modal
      :closable="false"
    >
      <template #header>
        <div class="dialog-header-custom">
          <div class="header-icon">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <h3 class="header-title">Registrar Nueva Venta</h3>
        </div>
      </template>

      <div class="dialog-content">
        <div class="field-container">
          <label class="field-label">
            <i class="pi pi-user field-icon"></i>
            Usuario
          </label>
          <div class="input-wrapper">
            <Dropdown
              v-model="idUsuario"
              :options="usuarios"
              optionLabel="usuario"
              optionValue="id"
              class="styled-input"
              placeholder="Seleccionar usuario"
            />
          </div>
        </div>

        <div class="field-container">
          <label class="field-label">
            <i class="pi pi-users field-icon"></i>
            Cliente
          </label>
          <div class="input-wrapper">
            <Dropdown
              v-model="idCliente"
              :options="clientes"
              optionLabel="nombre"
              optionValue="id"
              class="styled-input"
              placeholder="Seleccionar cliente"
            />
          </div>
        </div>

        <div class="field-container">
          <label class="field-label">
            <i class="pi pi-list field-icon"></i>
            Detalle de Venta
          </label>
          <div class="input-wrapper">
            <div class="detalle-producto-row">
              <Dropdown
                v-model="productoSeleccionado"
                :options="productos"
                optionLabel="nombre"
                placeholder="Seleccionar producto"
                class="styled-input"
              />
              <InputNumber
                v-model="cantidad"
                :min="1"
                class="styled-input-number cantidad-input"
                placeholder="Cantidad"
                showButtons
              />
              <Button
                label="Agregar"
                icon="pi pi-plus"
                class="btn-agregar"
                @click="agregarProducto"
              />
            </div>
          </div>
        </div>

        <div class="detalle-table-wrapper">
          <table class="detalle-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detalle" :key="index">
                <td>{{ item.producto.nombre }}</td>
                <td>{{ item.cantidad }}</td>
                <td>Bs {{ item.precioUnitario }}</td>
                <td>Bs {{ item.subtotal.toFixed(2) }}</td>
                <td>
                  <Button
                    icon="pi pi-trash"
                    class="btn-eliminar"
                    @click="detalle.splice(index, 1)"
                    severity="danger"
                    rounded
                  />
                </td>
              </tr>
              <tr v-if="detalle.length === 0">
                <td colspan="5" class="no-productos">No hay productos agregados</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total-venta">
          <span>Total:</span>
          <span class="total-monto">Bs {{ total.toFixed(2) }}</span>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-custom">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="btn-cancelar"
            @click="emit('cerrar')"
          />
          <Button
            type="button"
            label="Registrar Venta"
            icon="pi pi-save"
            class="btn-guardar"
            @click="registrarVenta"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.dialog-container {
  position: relative;
}

:deep(.producto-dialog) {
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

.field-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #333;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.field-icon {
  color: #ff6b35;
  font-size: 1.1rem;
}

.input-wrapper {
  position: relative;
}

:deep(.styled-input) {
  width: 100% !important;
  padding: 1rem 1.5rem !important;
  border: 2px solid #e0e0e0 !important;
  border-radius: 15px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}

:deep(.styled-input:focus) {
  border-color: #ff6b35 !important;
  box-shadow:
    0 0 0 3px rgba(255, 107, 53, 0.1),
    0 4px 20px rgba(255, 107, 53, 0.15) !important;
  outline: none !important;
}

:deep(.styled-input:hover) {
  border-color: #ff8c42 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

:deep(.styled-input-number) {
  width: 100% !important;
}

:deep(.styled-input-number .p-inputnumber-input) {
  width: 100% !important;
  padding: 1rem 1.5rem !important;
  border: 2px solid #e0e0e0 !important;
  border-radius: 15px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: rgb(3, 3, 3) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}

:deep(.styled-input-number .p-inputnumber-input:focus) {
  border-color: #ff6b35 !important;
  box-shadow:
    0 0 0 3px rgba(255, 107, 53, 0.1),
    0 4px 20px rgba(255, 107, 53, 0.15) !important;
  outline: none !important;
}

:deep(.styled-input-number .p-inputnumber-input:hover) {
  border-color: #ff8c42 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

:deep(.styled-input-number .p-inputnumber-button) {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: none !important;
  color: white !important;
  width: 40px !important;
  transition: all 0.3s ease !important;
}

:deep(.styled-input-number .p-inputnumber-button:hover) {
  background: linear-gradient(45deg, #f7931e, #ff8c42) !important;
  transform: scale(1.05) !important;
}

:deep(.styled-input-number .p-inputnumber-button-up) {
  border-radius: 0 15px 0 0 !important;
}

:deep(.styled-input-number .p-inputnumber-button-down) {
  border-radius: 0 0 15px 0 !important;
}

.detalle-producto-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cantidad-input {
  max-width: 120px;
}

.btn-agregar {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  border-radius: 15px !important;
  padding: 0.7rem 1.5rem !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2) !important;
  transition: all 0.3s ease !important;
}

.btn-agregar:hover {
  background: linear-gradient(45deg, #f7931e, #ff8c42) !important;
  transform: translateY(-2px) !important;
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
  background: rgb(0, 0, 0);
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

.no-productos {
  color: #ff6b35;
  font-style: italic;
  font-size: 1rem;
  padding: 1.5rem 0;
}

.btn-eliminar {
  background: linear-gradient(45deg, #f44336, #d32f2f) !important;
  border: none !important;
  color: white !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 15px !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-eliminar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 18px rgba(244, 67, 54, 0.4) !important;
  background: linear-gradient(45deg, #d32f2f, #c62828) !important;
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

.btn-guardar {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: none !important;
  color: white !important;
  padding: 0.8rem 2rem !important;
  border-radius: 25px !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  box-shadow: 0 5px 20px rgba(255, 107, 53, 0.3) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.btn-guardar:hover {
  background: linear-gradient(45deg, #f7931e, #ff8c42) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4) !important;
}

.btn-guardar:active {
  transform: translateY(-1px) !important;
}

.btn-guardar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-guardar:hover::before {
  left: 100%;
}

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
  .btn-cancelar,
  .btn-guardar {
    width: 100% !important;
    justify-content: center !important;
  }
  .detalle-producto-row {
    flex-direction: column;
    gap: 0.5rem;
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
:deep(.styled-input),
:deep(.p-dropdown .p-dropdown-label),
:deep(.p-dropdown-items .p-dropdown-item) {
  color: #222 !important;
  background: #000000 !important;
}
</style>
