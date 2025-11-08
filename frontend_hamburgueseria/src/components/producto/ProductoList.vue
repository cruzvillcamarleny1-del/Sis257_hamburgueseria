<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { computed, onMounted, ref } from 'vue'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref(false)
const emit = defineEmits(['edit'])
const busqueda = ref<string>('')

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
    <div class="table-container">
      <div class="table-wrapper">
        <table class="productos-table">
          <thead class="table-header">
            <tr>
              <th class="th-numero">Nro.</th>
              <th class="th-imagen">Imagen</th>
              <th class="th-nombre">Nombre</th>
              <th class="th-descripcion">Descripción</th>
              <th class="th-precio">Precio</th>
              <th class="th-stock">Stock</th>
              <th class="th-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="(producto, index) in productosFiltrados"
              :key="producto.id"
              class="producto-row"
            >
              <td class="td-numero">
                <span class="numero-badge">{{ index + 1 }}</span>
              </td>
              <td class="td-imagen">
                <div class="imagen-container">
                  <img
                    v-if="producto.imagen"
                    :src="producto.imagen"
                    alt="Producto"
                    class="producto-imagen"
                  />
                  <div v-else class="no-imagen">
                    <i class="pi pi-image"></i>
                  </div>
                </div>
              </td>
              <td class="td-nombre">
                <span class="producto-nombre">{{ producto.nombre }}</span>
              </td>
              <td class="td-descripcion">
                <span class="producto-descripcion">{{ producto.descripcion }}</span>
              </td>
              <td class="td-precio">
                <span class="precio-badge">Bs {{ producto.precio }}</span>
              </td>
              <td class="td-stock">
                <span class="stock-badge" :class="{ 'stock-bajo': producto.stock < 10 }">
                  {{ producto.stock }}
                </span>
              </td>
              <td class="td-acciones">
                <div class="acciones-container">
                  <Button
                    icon="pi pi-pencil"
                    @click="emitirEdicion(producto)"
                    class="btn-editar"
                    size="small"
                    rounded
                  />
                  <Button
                    icon="pi pi-trash"
                    @click="confirmarEliminar(producto)"
                    class="btn-eliminar"
                    size="small"
                    rounded
                  />
                </div>
              </td>
            </tr>
            <tr v-if="productosFiltrados.length === 0">
              <td colspan="7" class="no-resultados">
                <div class="no-resultados-content">
                  <i class="pi pi-search no-resultados-icon"></i>
                  <p>No se encontraron productos</p>
                  <small>Intenta con otro término de búsqueda</small>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  background: linear-gradient(
    135deg,
    #ff6b35 0%,
    #f7931e 25%,
    #ff8c42 50%,
    #e8722e 75%,
    #d4621a 100%
  );
  min-height: 100vh;
  position: relative;
}

.productos-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.3) 0%, transparent 50%);
  pointer-events: none;
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 25px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.search-addon {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: none !important;
  color: white !important;
  padding: 1rem !important;
}

.search-icon {
  font-size: 1.2rem;
  color: white;
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
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.3) !important;
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(255, 107, 53, 0.2);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 1400px;
  width: 100%;
  position: relative;
}

.table-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
}

/* Estilos de tabla */
.productos-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  position: relative;
}

.table-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
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
  background: rgba(255, 255, 255, 0.3);
}

.table-header th:last-child::after {
  display: none;
}

.table-body .producto-row {
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 107, 53, 0.1);
}

.table-body .producto-row:hover {
  background: linear-gradient(90deg, rgba(255, 107, 53, 0.05) 0%, rgba(247, 147, 30, 0.05) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.1);
}

.table-body td {
  padding: 1.2rem 1rem;
  text-align: center;
  vertical-align: middle;
  border: none;
}

/* Estilos específicos por columna */
.numero-badge {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3);
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
  border: 3px solid #ff6b35;
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
  transition: transform 0.3s ease;
}

.producto-imagen:hover {
  transform: scale(1.1);
}

.no-imagen {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  border: 2px dashed #ff6b35;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6b35;
  font-size: 2rem;
}

.producto-nombre {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

.producto-descripcion {
  color: #666;
  font-size: 0.95rem;
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.precio-badge {
  background: linear-gradient(45deg, #ff8c42, #f7931e);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4);
}

.stock-badge {
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);
}

.stock-badge.stock-bajo {
  background: linear-gradient(45deg, #f44336, #d32f2f);
  box-shadow: 0 3px 10px rgba(244, 67, 54, 0.3);
}

.acciones-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn-editar {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: none !important;
  color: white !important;
  width: 40px !important;
  height: 40px !important;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-editar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.4) !important;
  background: linear-gradient(45deg, #f7931e, #ff8c42) !important;
}

.btn-eliminar {
  background: linear-gradient(45deg, #f44336, #d32f2f) !important;
  border: none !important;
  color: white !important;
  width: 40px !important;
  height: 40px !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
  transition: all 0.3s ease !important;
}

.btn-eliminar:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 18px rgba(244, 67, 54, 0.4) !important;
  background: linear-gradient(45deg, #d32f2f, #c62828) !important;
}

/* No resultados */
.no-resultados {
  padding: 3rem 2rem !important;
  background: rgba(255, 107, 53, 0.05);
}

.no-resultados-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #666;
}

.no-resultados-icon {
  font-size: 3rem;
  color: #ff6b35;
  opacity: 0.7;
}

.no-resultados-content p {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
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
  color: #ff6b35;
  font-weight: 700;
  font-size: 1.2rem;
}

.dialog-icon {
  font-size: 1.5rem;
  color: #ff6b35;
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
  color: #ff6b35;
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
  border: 2px solid #ddd !important;
  color: #666 !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.btn-cancelar:hover {
  border-color: #ff6b35 !important;
  color: #ff6b35 !important;
  background: rgba(255, 107, 53, 0.05) !important;
}

.btn-confirmar-eliminar {
  background: linear-gradient(45deg, #f44336, #d32f2f) !important;
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
  background: linear-gradient(45deg, #d32f2f, #c62828) !important;
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
</style>
