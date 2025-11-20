<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

const clientesFiltrados = computed(() => {
  return clientes.value.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="cliente-list-container">
    <!-- Barra de búsqueda -->
    <div class="search-section">
      <div class="search-wrapper">
        <InputGroup class="search-input-group">
          <InputGroupAddon class="search-addon">
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText
            v-model="busqueda"
            type="text"
            placeholder="Buscar cliente por nombre..."
            class="search-input"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="table-container">
      <DataTable
        :value="clientesFiltrados"
        class="clientes-table"
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
            <span class="numero-cell">{{ slotProps.index + 1 }}</span>
          </template>
        </Column>
        <Column field="nombre" sortable>
          <template #header>
            <span class="th-nombre">Nombre</span>
          </template>
          <template #body="slotProps">
            <span class="nombre-cell">{{ slotProps.data.nombre }}</span>
          </template>
        </Column>
        <Column field="apellido" sortable>
          <template #header>
            <span class="th-apellido">Apellido</span>
          </template>
          <template #body="slotProps">
            <span class="apellido-cell">{{ slotProps.data.apellido }}</span>
          </template>
        </Column>
        <Column field="telefono" sortable>
          <template #header>
            <span class="th-telefono">Teléfono</span>
          </template>
          <template #body="slotProps">
            <span class="telefono-cell">{{ slotProps.data.telefono }}</span>
          </template>
        </Column>
        <Column field="direccion" sortable>
          <template #header>
            <span class="th-direccion">Dirección</span>
          </template>
          <template #body="slotProps">
            <span class="direccion-cell">{{ slotProps.data.direccion }}</span>
          </template>
        </Column>
        <Column>
          <template #header>
            <span class="th-acciones">Acciones</span>
          </template>
          <template #body="slotProps">
            <div class="action-buttons">
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                class="edit-button"
                size="small"
                @click="emitirEdicion(slotProps.data)"
                rounded
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                class="delete-button"
                size="small"
                @click="mostrarEliminarConfirm(slotProps.data)"
                rounded
              />
            </div>
          </template>
        </Column>
        <template #empty>
          <tr>
            <td colspan="6" class="no-results-cell">
              <div class="no-results-content">
                <i class="pi pi-search no-results-icon"></i>
                <p>No se encontraron clientes</p>
                <small>Intenta con otro término de búsqueda</small>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>

    <!-- Dialog de confirmación -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '28rem' }"
      class="confirm-dialog"
    >
      <div class="dialog-content">
        <div class="warning-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="dialog-text">
          <p>¿Estás seguro de que deseas eliminar este cliente?</p>
          <small v-if="clienteDelete"
            >{{ clienteDelete.nombre }} {{ clienteDelete.apellido }}</small
          >
        </div>
      </div>

      <div class="dialog-actions">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          class="cancel-button"
          @click="mostrarConfirmDialog = false"
        />
        <Button
          type="button"
          label="Eliminar"
          severity="danger"
          class="confirm-delete-button"
          @click="eliminar"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.cliente-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Búsqueda */
.search-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}
.search-wrapper {
  width: 100%;
  max-width: 500px;
}
:deep(.search-input-group) {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.35);
}
:deep(.search-addon) {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%) !important;
  border: none !important;
  color: #1a1a2e !important;
  padding: 0.85rem 1rem !important;
}
:deep(.search-input) {
  border: none !important;
  padding: 0.85rem 1rem !important;
  font-size: 1rem !important;
  background: #ffffff !important;
  color: #333 !important;
}
:deep(.search-input::placeholder) {
  color: #999 !important;
}
:deep(.search-input:focus) {
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3) !important;
  outline: none !important;
  background: #fff !important;
}

/* Tabla */
.table-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.25);
}
.clientes-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.clientes-table thead {
  background: linear-gradient(135deg, #393e46 0%, #222831 100%);
}
.clientes-table th {
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  border: none;
  position: relative;
}
.clientes-table th:first-child {
  text-align: center;
  width: 80px;
}
.clientes-table th:last-child {
  text-align: center;
  width: 140px;
}
.clientes-table th::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 215, 0, 0.35);
}
.clientes-table th:last-child::after {
  display: none;
}

/* Filas */
.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(57, 62, 70, 0.12);
}
.table-row:hover {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 235, 59, 0.12) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 215, 0, 0.2);
}
.clientes-table td {
  padding: 1rem;
  text-align: left;
  border: none;
  vertical-align: middle;
}

/* Celdas específicas */
.numero-cell {
  text-align: center;
  font-weight: 800;
  color: #ffbe33;
  font-size: 1.05rem;
}
.nombre-cell,
.apellido-cell {
  font-weight: 700;
  color: #222831;
}
.telefono-cell {
  color: #555;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
.direccion-cell {
  color: #6b6b6b;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.acciones-cell {
  text-align: center;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Botones de acción */
:deep(.edit-button) {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%) !important;
  border: none !important;
  color: #1a1a2e !important;
  border-radius: 10px !important;
  padding: 0.55rem 0.7rem !important;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.35) !important;
  transition: all 0.25s ease !important;
}
:deep(.edit-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 7px 22px rgba(255, 215, 0, 0.5) !important;
  filter: brightness(1.03) !important;
}
:deep(.delete-button) {
  background: linear-gradient(135deg, #f44336, #e57373) !important;
  border: none !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  padding: 0.55rem 0.7rem !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.25s ease !important;
}
:deep(.delete-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 7px 20px rgba(244, 67, 54, 0.45) !important;
}

/* Sin resultados */
.no-results-row {
  background: rgba(255, 215, 0, 0.06);
}
.no-results-cell {
  text-align: center;
  padding: 3rem 1rem;
}
.no-results-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: #5d5d5d;
}
.no-results-icon {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

/* Dialog de confirmación */
:deep(.confirm-dialog) {
  border-radius: 18px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 215, 0, 0.25) !important;
}
:deep(.confirm-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #393e46 0%, #222831 100%) !important;
  color: #ffffff !important;
  padding: 1.2rem 1.5rem !important;
}
:deep(.confirm-dialog .p-dialog-content) {
  padding: 1.8rem !important;
}
.dialog-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.warning-icon {
  color: #ffbe33;
  font-size: 1.8rem;
}
.dialog-text p {
  margin: 0 0 0.4rem 0;
  font-weight: 600;
  color: #333;
}
.dialog-text small {
  color: #777;
  font-style: italic;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}
:deep(.cancel-button) {
  background: transparent !important;
  border: 2px solid #393e46 !important;
  color: #222831 !important;
  border-radius: 12px !important;
  padding: 0.65rem 1.2rem !important;
  font-weight: 600 !important;
  transition: all 0.25s ease !important;
}
:deep(.cancel-button:hover) {
  border-color: #ffd700 !important;
  color: #ffd700 !important;
  background: rgba(255, 215, 0, 0.1) !important;
}
:deep(.confirm-delete-button) {
  background: linear-gradient(135deg, #f44336, #e57373) !important;
  border: none !important;
  color: #ffffff !important;
  border-radius: 12px !important;
  padding: 0.65rem 1.2rem !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.25s ease !important;
}
:deep(.confirm-delete-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 7px 20px rgba(244, 67, 54, 0.4) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .cliente-list-container {
    padding: 0.5rem;
  }
  .search-wrapper {
    max-width: 100%;
  }
  .clientes-table {
    font-size: 0.9rem;
  }
  .clientes-table th,
  .clientes-table td {
    padding: 0.75rem 0.5rem;
  }
  .direccion-cell {
    max-width: 120px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}
@media (max-width: 600px) {
  .clientes-table th:nth-child(4),
  .clientes-table td:nth-child(4),
  .clientes-table th:nth-child(5),
  .clientes-table td:nth-child(5) {
    display: none;
  }
}

/* Animación */
.cliente-list-container {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  text-shadow: 0 2px 8px rgba(0,0,0,0.18), 0 1px 0 #ffd700;
  box-shadow: 0 4px 18px 0 rgba(255, 215, 0, 0.09), 0 2px 8px rgba(0,0,0,0.10);
  vertical-align: middle;
  text-align: center;
  position: relative;
  transition: box-shadow 0.2s;
}
:deep(.p-datatable-thead > tr > th:not(:last-child)) {
  border-right: 1.5px solid rgba(237, 201, 1, 0.18);
}
:deep(.p-datatable-thead > tr > th:hover) {
  box-shadow: 0 6px 24px 0 rgba(255, 215, 0, 0.18), 0 2px 8px rgba(246, 4, 4, 0.13);
  background: linear-gradient(120deg, rgb(255, 238, 0) 60%, #ffd700 100%);
  color: #23272f;
}
.th-numero,
.th-nombre,
.th-apellido,
.th-telefono,
.th-direccion,
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
