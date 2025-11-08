<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'proveedores'
const proveedores = ref<Proveedor[]>([])
const emit = defineEmits(['edit'])
const proveedorDelete = ref<Proveedor | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

const proveedoresFiltrados = computed(() => {
  return proveedores.value.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(proveedor: Proveedor) {
  emit('edit', proveedor)
}

function mostrarEliminarConfirm(proveedor: Proveedor) {
  proveedorDelete.value = proveedor
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="proveedores-container">
    <div class="search-container">
      <InputGroup class="search-input">
        <InputGroupAddon class="search-addon">
          <i class="pi pi-search"></i>
        </InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar proveedor..."
          class="search-field"
        />
      </InputGroup>
    </div>

    <div class="table-container">
      <table class="proveedores-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(proveedor, index) in proveedoresFiltrados"
            :key="proveedor.id"
            class="table-row"
          >
            <td class="number-cell">{{ index + 1 }}</td>
            <td class="name-cell">{{ proveedor.nombre }}</td>
            <td>{{ proveedor.telefono }}</td>
            <td class="email-cell">{{ proveedor.correo }}</td>
            <td>{{ proveedor.direccion }}</td>
            <td class="actions-cell">
              <Button
                icon="pi pi-pencil"
                aria-label="Editar"
                text
                class="edit-btn"
                @click="emitirEdicion(proveedor)"
              />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                text
                severity="danger"
                class="delete-btn"
                @click="mostrarEliminarConfirm(proveedor)"
              />
            </td>
          </tr>
          <tr v-if="proveedoresFiltrados.length === 0" class="no-results-row">
            <td colspan="6" class="no-results-cell">
              <i class="pi pi-info-circle"></i>
              No se encontraron resultados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
      class="confirm-dialog"
    >
      <div class="dialog-content">
        <i class="pi pi-exclamation-triangle dialog-icon"></i>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <p class="dialog-subtitle">Esta acción no se puede deshacer.</p>
      </div>

      <div class="dialog-actions">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          class="cancel-btn"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" class="confirm-delete-btn" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.proveedores-container {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.search-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
}

.search-input {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.search-addon {
  background: linear-gradient(135deg, #ff8c00, #ff7700) !important;
  color: white !important;
  border: none !important;
  padding: 0.75rem 1rem;
}

.search-field {
  border: 2px solid #ffb366 !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
}

.search-field:focus {
  border-color: #ff8c00 !important;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2) !important;
  outline: none !important;
}

.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 140, 0, 0.1);
  border: 1px solid #ffe0cc;
}

.proveedores-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.proveedores-table thead {
  background: linear-gradient(135deg, #ff8c00, #ff7700);
  color: white;
}

.proveedores-table th {
  padding: 1.2rem 1rem;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
  border: none;
  position: relative;
}

.proveedores-table th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #ffe8d6;
}

.table-row:hover {
  background: linear-gradient(135deg, #fff8f5, #ffefdf);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.1);
}

.table-row:nth-child(even) {
  background: #fffaf7;
}

.table-row:nth-child(even):hover {
  background: linear-gradient(135deg, #fff8f5, #ffefdf);
}

.proveedores-table td {
  padding: 1rem;
  text-align: center;
  border: none;
  vertical-align: middle;
}

.number-cell {
  font-weight: 600;
  color: #ff8c00;
  background: #fff5f0;
  width: 60px;
}

.name-cell {
  font-weight: 600;
  color: #cc5500;
  text-align: left;
}

.email-cell {
  color: #ff7700;
  font-style: italic;
}

.actions-cell {
  white-space: nowrap;
}

.edit-btn {
  background: linear-gradient(135deg, #4caf50, #45a049) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.5rem !important;
  margin: 0 0.25rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
}

.edit-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4) !important;
}

.delete-btn {
  background: linear-gradient(135deg, #f44336, #d32f2f) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.5rem !important;
  margin: 0 0.25rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3) !important;
}

.delete-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 16px rgba(244, 67, 54, 0.4) !important;
}

.no-results-row {
  background: #fff8f5 !important;
}

.no-results-cell {
  padding: 3rem !important;
  color: #ff8c00;
  font-size: 1.1rem;
  font-weight: 500;
}

.no-results-cell i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  color: #ffb366;
}

/* Dialog Styles */
:deep(.confirm-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ff8c00, #ff7700);
  color: white;
  border: none;
  border-radius: 12px 12px 0 0;
}

:deep(.confirm-dialog .p-dialog-content) {
  border: none;
  padding: 2rem;
  background: #fff8f5;
}

:deep(.confirm-dialog .p-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(255, 140, 0, 0.2);
  border: 2px solid #ffe0cc;
}

.dialog-content {
  text-align: center;
  margin-bottom: 1.5rem;
}

.dialog-icon {
  font-size: 3rem;
  color: #ff8c00;
  margin-bottom: 1rem;
  display: block;
}

.dialog-content p {
  font-size: 1.1rem;
  color: #666;
  margin: 0.5rem 0;
}

.dialog-subtitle {
  font-size: 0.9rem !important;
  color: #999 !important;
  font-style: italic;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ffe0cc;
}

.cancel-btn {
  background: #f5f5f5 !important;
  color: #666 !important;
  border: 2px solid #ddd !important;
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.cancel-btn:hover {
  background: #e9e9e9 !important;
  border-color: #bbb !important;
  transform: translateY(-1px) !important;
}

.confirm-delete-btn {
  background: linear-gradient(135deg, #f44336, #d32f2f) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
}

.confirm-delete-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .proveedores-container {
    padding: 1rem;
  }

  .search-input {
    max-width: 100%;
  }

  .proveedores-table {
    font-size: 0.8rem;
  }

  .proveedores-table th,
  .proveedores-table td {
    padding: 0.5rem;
  }

  .actions-cell {
    white-space: normal;
  }

  .edit-btn,
  .delete-btn {
    margin: 0.125rem !important;
    padding: 0.375rem !important;
  }
}

@media (max-width: 480px) {
  .table-container {
    overflow-x: auto;
  }

  .proveedores-table {
    min-width: 600px;
  }
}
</style>
