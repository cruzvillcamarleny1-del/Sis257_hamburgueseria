<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { computed, onMounted, ref } from 'vue'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref(false)
const emit = defineEmits(['edit'])
const busqueda = ref<string>('')

const paginaActual = ref(1)
const filasPorPagina = ref(10)

const totalPaginas = computed(() =>
  Math.ceil(productosFiltrados.value.length / filasPorPagina.value),
)

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina.value
  const fin = inicio + filasPorPagina.value
  return productosFiltrados.value.slice(inicio, fin)
})

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((res) => res.data)
}

const productosFiltrados = computed(() => {
  return productos.value.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function confirmarEliminar(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="productos-container">
    <!-- Barra de búsqueda estilizada -->
    <div class="search-section">
      <div class="search-wrapper">
        <InputGroup class="search-input-group">
          <InputGroupAddon class="search-addon">
            <i class="pi pi-search search-icon"></i>
          </InputGroupAddon>
          <InputText
            v-model="busqueda"
            type="text"
            placeholder="Buscar producto..."
            class="search-input"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Tabla de productos con diseño moderno -->
    <!-- Reemplaza el bloque de la tabla por esto -->
    <div class="table-container">
      <DataTable
        :value="productosFiltrados"
        class="productos-table"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column>
          <template #header>
            <span class="th-numero">Nro.</span>
          </template>
          <template #body="slotProps">
            <span class="numero-badge">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>
        <Column>
          <template #header>
            <span class="th-imagen">Imagen</span>
          </template>
          <template #body="slotProps">
            <div class="imagen-container">
              <img
                v-if="slotProps.data.imagen"
                :src="slotProps.data.imagen"
                alt="Producto"
                class="producto-imagen"
              />
              <div v-else class="no-imagen">
                <i class="pi pi-image"></i>
              </div>
            </div>
          </template>
        </Column>
        <Column field="nombre" sortable>
          <template #header>
            <span class="th-nombre">Nombre</span>
          </template>
          <template #body="slotProps">
            <span class="producto-nombre">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>
        <Column field="descripcion" sortable>
          <template #header>
            <span class="th-descripcion">Descripción</span>
          </template>
          <template #body="slotProps">
            <span class="producto-descripcion">{{ slotProps.data.descripcion }}</span>
          </template>
        </Column>
        <Column field="precio" sortable>
          <template #header>
            <span class="th-precio">Precio</span>
          </template>
          <template #body="slotProps">
            <span class="precio-badge">Bs {{ slotProps.data.precio }}</span>
          </template>
        </Column>
        <Column field="stock" sortable>
          <template #header>
            <span class="th-stock">Stock</span>
          </template>
          <template #body="slotProps">
            <span class="stock-badge" :class="{ 'stock-bajo': slotProps.data.stock < 10 }">
              {{ slotProps.data.stock }}
            </span>
          </template>
        </Column>
        <Column>
          <template #header>
            <span class="th-acciones">Acciones</span>
          </template>
          <template #body="slotProps">
            <div class="acciones-container">
              <Button
                icon="pi pi-pencil"
                @click="emitirEdicion(slotProps.data)"
                class="btn-editar"
                size="small"
                rounded
              />
              <Button
                icon="pi pi-trash"
                @click="confirmarEliminar(slotProps.data)"
                class="btn-eliminar"
                size="small"
                rounded
              />
            </div>
          </template>
        </Column>
        <template #empty>
          <tr>
            <td colspan="7" class="no-resultados">
              <div class="no-resultados-content">
                <i class="pi pi-search no-resultados-icon"></i>
                <p>No se encontraron productos</p>
                <small>Intenta con otro término de búsqueda</small>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>

    <!-- Dialog de confirmación estilizado -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      class="confirm-dialog"
      header="Confirmar Eliminación"
      :style="{ width: '400px' }"
      modal
    >
      <template #header>
        <div class="dialog-header">
          <i class="pi pi-exclamation-triangle dialog-icon"></i>
          <span>Confirmar Eliminación</span>
        </div>
      </template>

      <div class="dialog-content">
        <p class="confirm-text">
          ¿Estás seguro de que deseas eliminar el producto
          <strong class="producto-highlight">{{ productoDelete?.nombre }}</strong
          >?
        </p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button
            label="Cancelar"
            class="btn-cancelar"
            @click="mostrarConfirmDialog = false"
            outlined
          />
          <Button label="Eliminar" class="btn-confirmar-eliminar" @click="eliminar" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.productos-container {
  padding: 2rem;
  background: transparent;
  min-height: auto;
  position: relative;
}

.productos-container::before {
  display: none;
}

/* Sección de búsqueda */
.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.search-wrapper {
  width: 100%;
  max-width: 500px;
}

.search-input-group {
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
  border-radius: 25px;
  overflow: hidden;
  border: 2px solid rgba(255, 215, 0, 0.4);
}

.search-addon {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%) !important;
  border: none !important;
  color: #1a1a2e !important;
  padding: 1rem !important;
}

.search-icon {
  font-size: 1.2rem;
  color: #1a1a2e;
}

.search-input {
  background: rgba(255, 255, 255, 0.95) !important;
  border: none !important;
  padding: 1rem 1.5rem !important;
  font-size: 1.1rem !important;
  color: #333 !important;
  font-weight: 500;
}

.search-input::placeholder {
  color: #999 !important;
  font-style: italic;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3) !important;
  background: white !important;
}

/* Contenedor de tabla */
.table-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.table-wrapper {
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  backdrop-filter: none;
  border: none;
  max-width: 100%;
  width: 100%;
  position: relative;
}

.table-wrapper::before {
  display: none;
}

/* Estilos de tabla */
.productos-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  position: relative;
}

.table-header {
  background: linear-gradient(135deg, #393e46 0%, #222831 100%);
  color: white;
}

.table-header th {
  padding: 1.5rem 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  border: none;
  position: relative;
}

.table-header th::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 215, 0, 0.35);
}

.table-header th:last-child::after {
  display: none;
}

.table-body .producto-row {
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(57, 62, 70, 0.1);
}

.table-body .producto-row:hover {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 235, 59, 0.12) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(255, 215, 0, 0.25);
}

.table-body td {
  padding: 1.2rem 1rem;
  text-align: centrer;
  vertical-align: middle;
  border: none;
}

/* Estilos específicos por columna */
.numero-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%);
  color: #1a1a2e;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.imagen-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.producto-imagen {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 15px;
  border: 3px solid #ffd700;
  box-shadow: 0 5px 18px rgba(255, 215, 0, 0.35);
  transition: transform 0.3s ease;
}

.producto-imagen:hover {
  transform: scale(1.1);
}

.no-imagen {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 235, 59, 0.1));
  border: 2px dashed #ffd700;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 2rem;
}

.producto-nombre {
  font-weight: 700;
  color: #222831;
  font-size: 1.1rem;
}

.producto-descripcion {
  color: #6e6e6e;
  font-size: 0.95rem;
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.precio-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffc107 50%, #ffeb3b 100%);
  color: #1a1a2e;
  padding: 0.6rem 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px rgba(255, 215, 0, 0.4);
}

.stock-badge {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);
}

.stock-badge.stock-bajo {
  background: linear-gradient(135deg, #f44336, #e57373);
  box-shadow: 0 3px 10px rgba(244, 67, 54, 0.35);
}

.acciones-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn-editar {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%) !important;
  border: none !important;
  color: #1a1a2e !important;
  width: 40px !important;
  height: 40px !important;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4) !important;
  transition: all 0.3s ease !important;
}

.btn-editar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.55) !important;
  background: linear-gradient(135deg, #ffeb3b 0%, #ffd700 100%) !important;
}

.btn-eliminar {
  background: linear-gradient(135deg, #f44336, #e57373) !important;
  border: none !important;
  color: white !important;
  width: 40px !important;
  height: 40px !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-eliminar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 18px rgba(244, 67, 54, 0.45) !important;
  background: linear-gradient(135deg, #e57373, #f44336) !important;
}

/* No resultados */
.no-resultados {
  padding: 3rem 2rem !important;
  background: rgba(255, 215, 0, 0.06);
}

.no-resultados-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6d6d6d;
}

.no-resultados-icon {
  font-size: 3rem;
  color: #ffd700;
  opacity: 0.8;
}

.no-resultados-content p {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #1a1a2e;
}

.no-resultados-content small {
  color: #999;
  font-size: 0.9rem;
}

/* Dialog estilos */
.confirm-dialog {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3) !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #f44336;
  font-weight: 700;
  font-size: 1.2rem;
}

.dialog-icon {
  font-size: 1.5rem;
  color: #f44336;
}

.dialog-content {
  padding: 1.5rem 0;
}

.confirm-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.producto-highlight {
  color: #ffd700;
  font-weight: 700;
}

.warning-text {
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
  margin: 0;
}

.dialog-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
}

.btn-cancelar {
  background: transparent !important;
  border: 2px solid #393e46 !important;
  color: #656363 !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.btn-cancelar:hover {
  border-color: #ffd700 !important;
  color: #ffd700 !important;
  background: rgba(255, 215, 0, 0.1) !important;
}

.btn-confirmar-eliminar {
  background: linear-gradient(135deg, #f44336, #e57373) !important;
  border: none !important;
  color: white !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-confirmar-eliminar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4) !important;
  background: linear-gradient(135deg, #e57373, #f44336) !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .productos-container {
    padding: 1rem;
  }

  .producto-descripcion {
    max-width: 150px;
  }
}

@media (max-width: 768px) {
  .search-wrapper {
    max-width: 100%;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .productos-table {
    min-width: 800px;
  }

  .table-header th {
    padding: 1rem 0.5rem;
    font-size: 0.8rem;
  }

  .table-body td {
    padding: 1rem 0.5rem;
  }

  .producto-imagen {
    width: 60px;
    height: 60px;
  }

  .no-imagen {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .acciones-container {
    flex-direction: column;
    gap: 0.3rem;
  }

  .btn-editar,
  .btn-eliminar {
    width: 35px !important;
    height: 35px !important;
  }
}

@media (max-width: 480px) {
  .confirm-dialog {
    width: 95% !important;
    max-width: 350px !important;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-cancelar,
  .btn-confirmar-eliminar {
    width: 100% !important;
    justify-content: center !important;
  }
}

:deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(120deg, #23272f 60%, #393e46 100%);
  color: #fff;
  border: none;
  border-bottom: 4px solid #ffd700;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 1.1rem 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1rem;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.18),
    0 1px 0 #ffd700;
  box-shadow:
    0 4px 18px 0 rgba(255, 215, 0, 0.09),
    0 2px 8px rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  text-align: center;
  position: relative;
  transition: box-shadow 0.2s;
}

:deep(.p-datatable-thead > tr > th:not(:last-child)) {
  border-right: 1.5px solid rgba(237, 201, 1, 0.18);
}

:deep(.p-datatable-thead > tr > th:hover) {
  box-shadow:
    0 6px 24px 0 rgba(255, 215, 0, 0.18),
    0 2px 8px rgba(246, 4, 4, 0.13);
  background: linear-gradient(120deg, rgb(255, 238, 0) 60%, #ffd700 100%);
  color: #23272f;
}

.th-numero,
.th-imagen,
.th-nombre,
.th-descripcion,
.th-precio,
.th-stock,
.th-acciones {
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 0.85rem;
  color: inherit;
  padding: 0;
  background: none;
  border-radius: 0;
}
</style>
