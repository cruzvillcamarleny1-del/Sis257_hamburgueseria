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
import { reactive } from 'vue'

const mostrarSubformCliente = ref(false)
const nuevoCliente = reactive<{
  ci: string
  nombre: string
  apellido: string
  telefono: string
  direccion: string
}>({
  ci: '',
  nombre: '',
  apellido: '',
  telefono: '',
  direccion: '',
})

const clientesDropdown = computed(() =>
  clientes.value.map((c) => ({
    ...c,
    label: `${c.nombre} ${c.apellido} (${c.ci || 'Sin CI'})`,
  })),
)

const props = defineProps<{ mostrar: boolean }>()
const emit = defineEmits(['cerrar', 'ventaGuardada'])
const cantidadesPorProducto = ref<{ [id: number]: number }>({})

const usuarios = ref<Usuario[]>([])
const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])

const busquedaProducto = ref('')

const productosFiltrados = computed(() =>
  productos.value.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaProducto.value.trim().toLowerCase()),
  ),
)

const idUsuario = ref<number>()
const idCliente = ref<number>()
const productoSeleccionado = ref<Producto | null>(null)
const cantidad = ref(1)

function getUserIdFromToken(): number | undefined {
  const raw = localStorage.getItem('token') || localStorage.getItem('access_token')
  if (!raw) return
  try {
    const parts = raw.split('.')
    if (!parts[1]) return
    const payload = JSON.parse(atob(parts[1]))
    return payload.sub ?? payload.id ?? payload.userId
  } catch {
    return
  }
}

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
  idUsuario.value = getUserIdFromToken() // setear automáticamente
}

function limpiarFormulario() {
  idUsuario.value = undefined
  idCliente.value = undefined
  productoSeleccionado.value = null
  cantidad.value = 1
  detalle.value = []
}

function agregarProductoDesdeCard(prod: Producto) {
  const cantidad = cantidadesPorProducto.value[prod.id] || 1

  if (detalle.value.find((item) => item.producto.id === prod.id)) {
    alert('Este producto ya fue agregado')
    return
  }

  detalle.value.push({
    producto: prod,
    cantidad,
    precioUnitario: Number(prod.precio),
    subtotal: cantidad * Number(prod.precio),
  })

  cantidadesPorProducto.value[prod.id] = 1
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
  if (!idCliente.value || detalle.value.length === 0) {
    alert('Debe completar todos los campos y agregar al menos un producto')
    return
  }
  const userId = idUsuario.value ?? getUserIdFromToken()
  if (!userId) {
    alert('No se pudo determinar el usuario actual')
    return
  }

  const venta = {
    idUsuario: userId,
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

async function guardarNuevoCliente() {
  if (
    !nuevoCliente.nombre.trim() ||
    !nuevoCliente.apellido.trim() ||
    !String(nuevoCliente.telefono).trim() ||
    !nuevoCliente.direccion.trim()
  ) {
    alert('Debe completar todos los campos')
    return
  }
  try {
    const res = await http.post('/clientes', { ...nuevoCliente })
    clientes.value.push(res.data)
    idCliente.value = res.data.id
    mostrarSubformCliente.value = false
    nuevoCliente.ci = ''
    nuevoCliente.nombre = ''
    nuevoCliente.apellido = ''
    nuevoCliente.telefono = ''
    nuevoCliente.direccion = ''
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Error al registrar cliente')
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
        <div class="field-container" v-if="false">
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
          <div class="input-wrapper" style="display: flex; gap: 0.5rem; align-items: center">
            <Dropdown
              v-model="idCliente"
              :options="clientesDropdown"
              optionLabel="label"
              optionValue="id"
              class="styled-input"
              placeholder="Seleccionar cliente"
              appendTo="self"
              filter
              :pt="{
                label: { style: { color: '#ffffff' } },
                trigger: { style: { color: '#ffbe33' } },
                panel: { style: { background: '#222831', border: '1px solid #393e46' } },
                item: { style: { color: '#eeeeee' } },
              }"
            />
            <Button
              icon="pi pi-user-plus"
              class="btn-agregar-cliente"
              style="padding: 0.6rem 1rem; border-radius: 12px"
              @click="mostrarSubformCliente = true"
              title="Agregar nuevo cliente"
            />
          </div>

          <Dialog
            v-model:visible="mostrarSubformCliente"
            header="Agregar Cliente Rápido"
            :style="{ width: '22rem' }"
            modal
            :closable="false"
          >
            <div style="display: flex; flex-direction: column; gap: 1rem">
              <input
                v-model="nuevoCliente.ci"
                type="text"
                class="styled-input"
                placeholder="CI"
                maxlength="20"
                style="margin-bottom: 0.5rem"
                @input="
                  (e) =>
                    (nuevoCliente.ci = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))
                "
              />
              <input
                v-model="nuevoCliente.nombre"
                type="text"
                class="styled-input"
                placeholder="Nombre"
                style="margin-bottom: 0.5rem"
              />
              <input
                v-model="nuevoCliente.apellido"
                type="text"
                class="styled-input"
                placeholder="Apellido"
                style="margin-bottom: 0.5rem"
              />
              <input
                v-model="nuevoCliente.telefono"
                type="text"
                class="styled-input"
                placeholder="Teléfono"
                maxlength="10"
                style="margin-bottom: 0.5rem"
                @input="
                  (e) =>
                    (nuevoCliente.telefono = (e.target as HTMLInputElement).value.replace(
                      /[^0-9]/g,
                      '',
                    ))
                "
              />
              <input
                v-model="nuevoCliente.direccion"
                type="text"
                class="styled-input"
                placeholder="Dirección"
                style="margin-bottom: 0.5rem"
              />
            </div>
            <template #footer>
              <Button
                label="Cancelar"
                icon="pi pi-times"
                class="btn-cancelar"
                @click="mostrarSubformCliente = false"
              />
              <Button
                label="Guardar"
                icon="pi pi-save"
                class="btn-guardar"
                @click="guardarNuevoCliente"
              />
            </template>
          </Dialog>
        </div>

        <div class="field-container">
          <label class="field-label">
            <i class="pi pi-list field-icon"></i>
            Detalle de Venta
          </label>
          <div class="input-wrapper">
            <input
              v-model="busquedaProducto"
              type="text"
              class="buscador-producto"
              placeholder="Buscar producto..."
            />
            <div class="productos-grid">
              <div v-for="prod in productosFiltrados" :key="prod.id" class="producto-card">
                <img v-if="prod.imagen" :src="prod.imagen" alt="img" class="producto-img" />
                <div class="producto-nombre">{{ prod.nombre }}</div>
                <div class="producto-precio">Bs {{ prod.precio }}</div>
                <InputNumber
                  v-model="cantidadesPorProducto[prod.id]"
                  :min="1"
                  class="styled-input-number cantidad-input"
                  placeholder="Cantidad"
                  showButtons
                  @update:modelValue="(val) => (cantidadesPorProducto[prod.id] = val)"
                />
                <Button
                  label="Agregar"
                  icon="pi pi-plus"
                  class="btn-agregar"
                  @click="agregarProductoDesdeCard(prod)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="detalle-table-wrapper">
          <table class="detalle-table">
            <thead>
              <tr>
                <th>Img</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detalle" :key="index">
                <td>
                  <img
                    v-if="item.producto.imagen"
                    :src="item.producto.imagen"
                    alt="img"
                    style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px"
                  />
                  <span v-else style="color: #aaa">Sin imagen</span>
                </td>
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
                <td colspan="6" class="no-productos">No hay productos agregados</td>
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

/* Dialog blanco con acentos dorados (igual a ProductoSave) */
:deep(.producto-dialog) {
  border-radius: 25px !important;
  overflow: hidden !important;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 190, 51, 0.3) !important;
  background: #ffffff !important;
}

:deep(.producto-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%) !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

:deep(.producto-dialog .p-dialog-content) {
  padding: 2rem !important;
  background: #ffffff !important;
}

:deep(.producto-dialog .p-dialog-footer) {
  background: #ffffff !important;
  border: none !important;
  padding: 1.5rem 2rem !important;
  border-top: 1px solid rgba(255, 190, 51, 0.3) !important;
}

/* Header personalizado (igual estructura a ProductoSave) */
.dialog-header-custom {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #222831;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.dialog-header-custom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffbe33 0%, #ffa500 50%, #ffbe33 100%);
}

.header-icon {
  background: linear-gradient(135deg, #ffbe33, #ffa500);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #222831;
  box-shadow: 0 4px 15px rgba(255, 190, 51, 0.4);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #222831;
}

/* Contenido y campos */
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
  color: #222831;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.field-icon {
  color: #ffbe33;
  font-size: 1.1rem;
}

.input-wrapper {
  position: relative;
}

/* Inputs oscuros (igual a ProductoSave) */
:deep(.styled-input) {
  width: 100% !important;
  padding: 1rem 1.5rem !important;
  border: 2px solid #393e46 !important;
  border-radius: 15px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: #222831 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

:deep(.styled-input:focus) {
  border-color: #ffbe33 !important;
  box-shadow:
    0 0 0 3px rgba(255, 190, 51, 0.2),
    0 4px 20px rgba(255, 190, 51, 0.3) !important;
  outline: none !important;
}

/* PrimeVue Dropdown como input oscuro */
:deep(.p-dropdown.styled-input) {
  background: #222831 !important;
  border: 2px solid #393e46 !important;
  border-radius: 15px !important;
  color: #ffffff !important;
}

:deep(.p-dropdown.styled-input .p-dropdown-label) {
  background: transparent !important;
  color: #ffffff !important;
}

:deep(.p-dropdown.styled-input .p-dropdown-trigger) {
  color: #ffbe33 !important;
}

:deep(.p-dropdown-panel) {
  background: #222831 !important;
  border: 1px solid #393e46 !important;
}

:deep(.p-dropdown-items .p-dropdown-item) {
  color: #eeeeee !important;
}

:deep(.p-dropdown-items .p-dropdown-item.p-highlight),
:deep(.p-dropdown-items .p-dropdown-item:hover) {
  background: rgba(255, 190, 51, 0.15) !important;
  color: #ffbe33 !important;
}

/* InputNumber oscuro */
:deep(.styled-input-number) {
  width: 100% !important;
}
:deep(.styled-input-number .p-inputnumber-input) {
  width: 100% !important;
  padding: 1rem 1.5rem !important;
  border: 2px solid #393e46 !important;
  border-radius: 15px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: #222831 !important;
  color: #ffffff !important;
}
:deep(.styled-input-number .p-inputnumber-input:focus) {
  border-color: #ffbe33 !important;
  box-shadow:
    0 0 0 3px rgba(255, 190, 51, 0.2),
    0 4px 20px rgba(255, 190, 51, 0.3) !important;
  outline: none !important;
}

/* Botones de InputNumber */
:deep(.styled-input-number .p-inputnumber-button) {
  width: 22px !important;
  height: 22px !important;
  font-size: 0.85rem !important;
  padding: 0 !important;
  border-radius: 6px !important;
}
:deep(.styled-input-number .p-inputnumber-button:hover) {
  background: linear-gradient(45deg, #ffa500, #ffbe33) !important;
  transform: scale(1.05) !important;
}
:deep(.styled-input-number .p-inputnumber-button-up) {
  border-radius: 0 15px 0 0 !important;
}
:deep(.styled-input-number .p-inputnumber-button-down) {
  border-radius: 0 0 15px 0 !important;
}

/* Fila de detalle */
.detalle-producto-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.cantidad-input {
  max-width: 140px;
}

/* Botón Agregar con dorado */
.btn-agregar {
  background: linear-gradient(45deg, #ffbe33, #ffa500) !important;
  border: none !important;
  color: #222831 !important;
  font-weight: 700 !important;
  border-radius: 15px !important;
  padding: 0.7rem 1.5rem !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 12px rgba(255, 190, 51, 0.25) !important;
  transition: all 0.3s ease !important;
}
.btn-agregar:hover {
  background: linear-gradient(45deg, #ffa500, #ffbe33) !important;
  transform: translateY(-2px) !important;
}

/* Tabla de detalle clara con acentos dorados */
.detalle-table-wrapper {
  margin-top: 1rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(255, 190, 51, 0.12);
  /* NUEVO: limita la altura y agrega scroll */
  max-height: 220px; /* ajusta según el alto de tus filas */
  overflow-y: auto;
}
.detalle-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  /* Para que el header quede fijo si quieres: */
  table-layout: fixed;
}
.detalle-table th,
.detalle-table td {
  color: #222831;
  padding: 0.7rem 0.5rem;
  text-align: center;
  font-size: 1rem;
}
.detalle-table th {
  background: linear-gradient(90deg, #ffbe33 0%, #ffa500 100%);
  color: #222831;
  font-weight: 800;
  border-bottom: 2px solid rgba(255, 190, 51, 0.5);
}
.detalle-table td {
  border-bottom: 1px solid rgba(57, 62, 70, 0.1);
}

.no-productos {
  color: #999;
  font-style: italic;
  font-size: 1rem;
  padding: 1.5rem 0;
}

/* Botón eliminar rojo */
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

/* Total de venta con badge dorado */
.total-venta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  color: #222831;
}
.total-monto {
  background: linear-gradient(135deg, #ffbe33, #ffa500);
  color: #222831;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(255, 190, 51, 0.25);
}

/* Footer botones */
.dialog-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;
}

.btn-cancelar {
  background: transparent !important;
  border: 2px solid #393e46 !important;
  color: #222831 !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  font-size: 0.95rem !important;
}
.btn-cancelar:hover {
  border-color: #ffbe33 !important;
  color: #ffbe33 !important;
  background: rgba(255, 190, 51, 0.1) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.btn-guardar {
  background: linear-gradient(45deg, #ffbe33, #ffa500) !important;
  border: none !important;
  color: #222831 !important;
  padding: 0.8rem 2rem !important;
  border-radius: 25px !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  box-shadow: 0 5px 20px rgba(255, 190, 51, 0.4) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}
.btn-guardar:hover {
  background: linear-gradient(45deg, #ffa500, #ffbe33) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 25px rgba(255, 190, 51, 0.5) !important;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}
.btn-guardar:hover::before {
  left: 100%;
}

.productos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  /* NUEVO: limita la altura y agrega scroll */
  max-height: 250px; /* ajusta según tu diseño, 3 filas aprox */
  overflow-y: auto;
  padding-right: 8px; /* para que no tape el scroll */
}
.producto-card {
  background: #222831;
  color: #fff;
  border-radius: 12px;
  padding: 1rem;
  width: 140px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  transition:
    border 0.2s,
    box-shadow 0.2s;
}
.producto-card.seleccionado {
  border: 2px solid #ffbe33;
  box-shadow: 0 4px 16px rgba(255, 190, 51, 0.15);
}
.producto-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.producto-nombre {
  font-weight: 700;
  margin-bottom: 0.3rem;
  text-align: center;
}
.producto-precio {
  color: #ffbe33;
  font-weight: 600;
  font-size: 1rem;
}
.buscador-producto {
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 2px solid #393e46;
  font-size: 1rem;
  background: #222831;
  color: #fff;
  outline: none;
  transition: border 0.2s;
}
.buscador-producto:focus {
  border-color: #ffbe33;
}

/* Animación entrada */
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
:deep(.producto-dialog) {
  animation: fadeInUp 0.4s ease-out !important;
}
.field-container {
  animation: fadeInUp 0.6s ease-out !important;
}
.field-container:nth-child(1) {
  animation-delay: 0.1s !important;
}
.field-container:nth-child(2) {
  animation-delay: 0.2s !important;
}
.field-container:nth-child(3) {
  animation-delay: 0.3s !important;
}
.field-container:nth-child(4) {
  animation-delay: 0.4s !important;
}
.field-container:nth-child(5) {
  animation-delay: 0.5s !important;
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
    font-size: 1.1rem;
  }
}

.styled-input-number.cantidad-input {
  max-width: 60px;
  font-size: 0.85rem;
  padding: 0.2rem 0.4rem !important;
}

:deep(.styled-input-number .p-inputnumber-input) {
  font-size: 0.85rem !important;
  padding: 0.3rem 0.5rem !important;
}

.btn-agregar {
  padding: 0.25rem 0.7rem !important;
  font-size: 0.85rem !important;
  border-radius: 8px !important;
  margin-top: 0.3rem;
}

.btn-agregar-cliente {
  background: linear-gradient(45deg, #ffbe33, #ffa500) !important;
  border: none !important;
  color: #222831 !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  box-shadow: 0 2px 8px rgba(255, 190, 51, 0.18) !important;
  transition: all 0.2s;
}
.btn-agregar-cliente:hover {
  background: linear-gradient(45deg, #ffa500, #ffbe33) !important;
  color: #222831 !important;
  transform: translateY(-2px) !important;
}
</style>
