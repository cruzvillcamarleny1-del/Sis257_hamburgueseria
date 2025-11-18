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
    <!-- Búsqueda -->
    <div class="search-section">
      <div class="search-wrapper">
        <InputGroup class="search-input-group">
          <InputGroupAddon class="search-addon">
            <i class="pi pi-search search-icon"></i>
          </InputGroupAddon>
          <InputText
            v-model="busqueda"
            type="text"
            placeholder="Buscar proveedor..."
            class="search-input"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="proveedores-table">
          <thead class="table-header">
            <tr>
              <th>Nro.</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="(proveedor, index) in proveedoresFiltrados"
              :key="proveedor.id"
              class="table-row"
            >
              <td class="number-cell">
                <span class="numero-badge">{{ index + 1 }}</span>
              </td>
              <td class="name-cell">{{ proveedor.nombre }}</td>
              <td>{{ proveedor.telefono }}</td>
              <td class="email-cell">{{ proveedor.correo }}</td>
              <td>{{ proveedor.direccion }}</td>
              <td class="actions-cell">
                <div class="acciones">
                  <Button
                    icon="pi pi-pencil"
                    aria-label="Editar"
                    class="btn-editar"
                    @click="emitirEdicion(proveedor)"
                    rounded
                    size="small"
                  />
                  <Button
                    icon="pi pi-trash"
                    aria-label="Eliminar"
                    class="btn-eliminar"
                    @click="mostrarEliminarConfirm(proveedor)"
                    rounded
                    size="small"
                  />
                </div>
              </td>
            </tr>

            <tr v-if="proveedoresFiltrados.length === 0">
              <td colspan="6" class="no-resultados">
                <div class="no-resultados-content">
                  <i class="pi pi-search no-resultados-icon"></i>
                  <p>No se encontraron proveedores</p>
                  <small>Intenta con otro término de búsqueda</small>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmación -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      class="confirm-dialog"
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
          ¿Estás seguro de eliminar al proveedor
          <strong class="proveedor-highlight">{{ proveedorDelete?.nombre }}</strong
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
.proveedores-container {
  padding: 2rem;
  background: transparent;
  min-height: auto;
  position: relative;
}

/* Búsqueda */
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

/* Tabla */
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
  border: none;
  max-width: 100%;
  width: 100%;
  position: relative;
}
.proveedores-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  position: relative;
}
.table-body {
  color: #1a1a2e;
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

.table-body .table-row {
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(57, 62, 70, 0.1);
}
.table-body .table-row:hover {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 235, 59, 0.12) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(255, 215, 0, 0.25);
}
.proveedores-table td {
  padding: 1.2rem 1rem;
  text-align: center;
  vertical-align: middle;
  border: none;
}

/* Celdas específicas */
.number-cell {
  color: #1a1a2e;
  width: 70px;
}
.numero-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%);
  color: #1a1a2e;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}
.name-cell {
  font-weight: 700;
  color: #000000;
}
.email-cell {
  color: #000000;
  font-style: italic;
}

/* Acciones */
.acciones {
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

/* Sin resultados */
.no-resultados {
  padding: 3rem 2rem !important;
  background: rgba(255, 215, 0, 0.06);
}
.no-resultados-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #000000;
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

/* Dialog confirmación */
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
.proveedor-highlight {
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
  color: #000000 !important;
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
  .proveedores-container {
    padding: 1rem;
  }
}
@media (max-width: 768px) {
  .search-wrapper {
    max-width: 100%;
  }
  .table-wrapper {
    overflow-x: auto;
  }
  .proveedores-table {
    min-width: 800px;
  }
  .table-header th {
    padding: 1rem 0.5rem;
    font-size: 0.8rem;
  }
  .proveedores-table td {
    padding: 1rem 0.5rem;
  }
  .acciones {
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
</style>
