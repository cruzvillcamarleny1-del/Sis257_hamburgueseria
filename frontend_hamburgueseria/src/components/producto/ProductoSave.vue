<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { ref, computed, watch } from 'vue'

const ENDPOINT = 'productos'

const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (val) => {
    if (!val) emit('close')
  },
})

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      imagen: producto.value.imagen,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      precio: producto.value.precio,
      stock: producto.value.stock,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (err: any) {
    alert(err?.response?.data?.message)
  }
}
</script>

<template>
  <div class="dialog-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Producto' : 'Crear Producto'"
      class="producto-dialog"
      :style="{ width: '35rem' }"
      modal
      :closable="false"
    >
      <template #header>
        <div class="dialog-header-custom">
          <div class="header-icon">
            <i :class="props.modoEdicion ? 'pi pi-pencil' : 'pi pi-plus'"></i>
          </div>
          <h3 class="header-title">
            {{ props.modoEdicion ? 'Editar Producto' : 'Crear Producto' }}
          </h3>
        </div>
      </template>

      <div class="dialog-content">
        <!-- Campo Imagen -->
        <div class="field-container">
          <label for="imagen" class="field-label">
            <i class="pi pi-image field-icon"></i>
            Imagen URL
          </label>
          <div class="input-wrapper">
            <InputText
              id="imagen"
              v-model="producto.imagen"
              class="styled-input"
              placeholder="https://ejemplo.com/imagen.jpg"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Campo Nombre -->
        <div class="field-container">
          <label for="nombre" class="field-label">
            <i class="pi pi-tag field-icon"></i>
            Nombre del Producto
          </label>
          <div class="input-wrapper">
            <InputText
              id="nombre"
              v-model="producto.nombre"
              class="styled-input"
              placeholder="Ingresa el nombre del producto"
            />
          </div>
        </div>

        <!-- Campo Descripción -->
        <div class="field-container">
          <label for="descripcion" class="field-label">
            <i class="pi pi-align-left field-icon"></i>
            Descripción
          </label>
          <div class="input-wrapper">
            <InputText
              id="descripcion"
              v-model="producto.descripcion"
              class="styled-input"
              placeholder="Describe las características del producto"
            />
          </div>
        </div>

        <!-- Campo Precio -->
        <div class="field-container">
          <label for="precio" class="field-label">
            <i class="pi pi-money-bill field-icon"></i>
            Precio (Bs)
          </label>
          <div class="input-wrapper">
            <InputNumber
              id="precio"
              v-model="producto.precio"
              class="styled-input-number"
              inputId="precio"
              :min="0"
              :step="0.01"
              mode="decimal"
              :useGrouping="false"
              showButtons
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Campo Stock -->
        <div class="field-container">
          <label for="stock" class="field-label">
            <i class="pi pi-box field-icon"></i>
            Cantidad en Stock
          </label>
          <div class="input-wrapper">
            <InputNumber
              id="stock"
              v-model="producto.stock"
              class="styled-input-number"
              :min="0"
              showButtons
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-custom">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="btn-cancelar"
            @click="dialogVisible = false"
          />
          <Button
            type="button"
            label="Guardar"
            icon="pi pi-save"
            class="btn-guardar"
            @click="handleSave"
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

/* Estilos del Dialog */
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

/* Header personalizado */
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

/* Contenido del dialog */
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

/* Estilos de inputs */
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

/* Estilos para InputNumber */
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
  background: white !important;
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

/* Botones de InputNumber */
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

/* Footer personalizado */
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

/* Placeholder styles */
:deep(.styled-input::placeholder) {
  color: #999 !important;
  font-style: italic !important;
}

:deep(.styled-input-number .p-inputnumber-input::placeholder) {
  color: #999 !important;
  font-style: italic !important;
}

/* Animaciones */
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
    width: 95% !important;
    max-width: 500px !important;
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
}
</style>
