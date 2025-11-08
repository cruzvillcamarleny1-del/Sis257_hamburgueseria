<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

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
      <table class="clientes-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id" class="table-row">
            <td class="numero-cell">{{ index + 1 }}</td>
            <td class="nombre-cell">{{ cliente.nombre }}</td>
            <td class="apellido-cell">{{ cliente.apellido }}</td>
            <td class="telefono-cell">{{ cliente.telefono }}</td>
            <td class="direccion-cell">{{ cliente.direccion }}</td>
            <td class="acciones-cell">
              <div class="action-buttons">
                <Button
                  icon="pi pi-pencil"
                  aria-label="Editar"
                  text
                  class="edit-button"
                  size="small"
                  @click="emitirEdicion(cliente)"
                />
                <Button
                  icon="pi pi-trash"
                  aria-label="Eliminar"
                  text
                  severity="danger"
                  class="delete-button"
                  size="small"
                  @click="mostrarEliminarConfirm(cliente)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="clientesFiltrados.length === 0" class="no-results-row">
            <td colspan="6" class="no-results-cell">
              <div class="no-results-content">
                <i class="pi pi-search no-results-icon"></i>
                <p>No se encontraron clientes</p>
                <small>Intenta con otro término de búsqueda</small>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

/* Sección de búsqueda */
.search-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-wrapper {
  width: 100%;
  max-width: 400px;
}

:deep(.search-input-group) {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
  border: 2px solid #ffe4d6;
}

:deep(.search-addon) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%) !important;
  border: none !important;
  color: white !important;
  padding: 0.75rem 1rem !important;
}

:deep(.search-input) {
  border: none !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  background: white !important;
}

:deep(.search-input:focus) {
  box-shadow: none !important;
  outline: none !important;
}

/* Contenedor de tabla */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.1);
  overflow: hidden;
  border: 1px solid #ffe4d6;
}

/* Estilos de tabla */
.clientes-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.clientes-table thead {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
}

.clientes-table th {
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  border: none;
}

.clientes-table th:first-child {
  text-align: center;
  width: 80px;
}

.clientes-table th:last-child {
  text-align: center;
  width: 120px;
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:hover {
  background-color: #fff8f0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
}

.clientes-table td {
  padding: 1rem;
  text-align: left;
  border: none;
  vertical-align: middle;
}

.numero-cell {
  text-align: center;
  font-weight: 600;
  color: #ff6b35;
  font-size: 1.1rem;
}

.nombre-cell,
.apellido-cell {
  font-weight: 500;
  color: #333;
}

.telefono-cell {
  color: #666;
  font-family: monospace;
}

.direccion-cell {
  color: #666;
  max-width: 200px;
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
  background: white !important;
  border: 1px solid #ddd !important;
  color: #ff6b35 !important;
  border-radius: 6px !important;
  padding: 0.5rem !important;
  transition: all 0.2s ease !important;
}

:deep(.edit-button:hover) {
  background: #fff8f0 !important;
  border-color: #ff6b35 !important;
  transform: scale(1.05) !important;
}

:deep(.delete-button) {
  background: white !important;
  border: 1px solid #ddd !important;
  color: #d32f2f !important;
  border-radius: 6px !important;
  padding: 0.5rem !important;
  transition: all 0.2s ease !important;
}

:deep(.delete-button:hover) {
  background: #fef2f2 !important;
  border-color: #d32f2f !important;
  transform: scale(1.05) !important;
}

/* Fila sin resultados */
.no-results-row {
  background: #f9f9f9;
}

.no-results-cell {
  text-align: center;
  padding: 3rem 1rem;
}

.no-results-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.no-results-icon {
  font-size: 2rem;
  color: #ff6b35;
  margin-bottom: 0.5rem;
}

/* Dialog de confirmación */
:deep(.confirm-dialog) {
  border-radius: 12px !important;
  overflow: hidden !important;
}

:deep(.confirm-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%) !important;
  color: white !important;
  padding: 1.5rem !important;
}

:deep(.confirm-dialog .p-dialog-content) {
  padding: 2rem !important;
}

.dialog-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.warning-icon {
  color: #ff6b35;
  font-size: 2rem;
}

.dialog-text p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #333;
}

.dialog-text small {
  color: #666;
  font-style: italic;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

:deep(.cancel-button) {
  background: #f5f5f5 !important;
  border: 1px solid #ddd !important;
  color: #666 !important;
  border-radius: 6px !important;
  padding: 0.75rem 1.5rem !important;
}

:deep(.cancel-button:hover) {
  background: #e9e9e9 !important;
  border-color: #ccc !important;
}

:deep(.confirm-delete-button) {
  background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%) !important;
  border: none !important;
  color: white !important;
  border-radius: 6px !important;
  padding: 0.75rem 1.5rem !important;
}

:deep(.confirm-delete-button:hover) {
  filter: brightness(1.1) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3) !important;
}

/* Responsive design */
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

/* Animación de carga */
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
</style>
