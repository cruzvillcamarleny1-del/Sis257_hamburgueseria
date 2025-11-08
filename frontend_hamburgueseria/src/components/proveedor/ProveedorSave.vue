<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'proveedores'

const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor,
    default: () => ({}) as Proveedor,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const proveedor = ref<Proveedor>({ ...props.proveedor })
watch(
  () => props.proveedor,
  (newVal) => {
    proveedor.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: proveedor.value.nombre,
      telefono: proveedor.value.telefono,
      correo: proveedor.value.correo,
      direccion: proveedor.value.direccion,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${proveedor.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    proveedor.value = {} as Proveedor
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="dialog-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Proveedor' : 'Crear Proveedor'"
      class="proveedor-dialog"
      :style="{ width: '32rem' }"
      :modal="true"
      :draggable="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <i :class="props.modoEdicion ? 'pi pi-pencil' : 'pi pi-plus'"></i>
          </div>
          <h3 class="header-title">
            {{ props.modoEdicion ? 'Editar Proveedor' : 'Crear Nuevo Proveedor' }}
          </h3>
        </div>
      </template>

      <div class="form-container">
        <div class="form-group">
          <label for="nombre" class="form-label">
            <i class="pi pi-user label-icon"></i>
            Nombre del Proveedor
          </label>
          <InputText
            id="nombre"
            v-model="proveedor.nombre"
            class="form-input"
            placeholder="Ingrese el nombre completo"
            autocomplete="off"
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="telefono" class="form-label">
            <i class="pi pi-phone label-icon"></i>
            Teléfono
          </label>
          <InputText
            id="telefono"
            v-model="proveedor.telefono"
            class="form-input"
            placeholder="Ej: +591 12345678"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="correo" class="form-label">
            <i class="pi pi-envelope label-icon"></i>
            Correo Electrónico
          </label>
          <InputText
            id="correo"
            v-model="proveedor.correo"
            class="form-input"
            placeholder="ejemplo@correo.com"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="direccion" class="form-label">
            <i class="pi pi-map-marker label-icon"></i>
            Dirección
          </label>
          <InputText
            id="direccion"
            v-model="proveedor.direccion"
            class="form-input"
            placeholder="Ingrese la dirección completa"
            autocomplete="off"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="cancel-button"
            @click="dialogVisible = false"
          />
          <Button
            type="button"
            :label="props.modoEdicion ? 'Actualizar' : 'Crear'"
            :icon="props.modoEdicion ? 'pi pi-check' : 'pi pi-save'"
            class="save-button"
            @click="handleSave"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.dialog-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Dialog Styles */
:deep(.proveedor-dialog .p-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(255, 140, 0, 0.25);
  border: 3px solid #ffe0cc;
  background: white;
}

:deep(.proveedor-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ff8c00 0%, #ff7700 50%, #ff6600 100%);
  color: white;
  padding: 1.5rem 2rem;
  border: none;
  position: relative;
  overflow: hidden;
}

:deep(.proveedor-dialog .p-dialog-header::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><linearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="0%25"><stop offset="0%25" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" /><stop offset="100%25" style="stop-color:rgba(255,255,255,0);stop-opacity:1" /></linearGradient></defs><polygon fill="url(%23grad)" points="0,0 100,0 85,20 0,20"/></svg>')
    no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
}

:deep(.proveedor-dialog .p-dialog-header-icons) {
  display: none;
}

:deep(.proveedor-dialog .p-dialog-content) {
  padding: 2rem;
  background: linear-gradient(135deg, #fff8f5 0%, #ffefdf 100%);
  border: none;
}

:deep(.proveedor-dialog .p-dialog-footer) {
  background: #fff5f0;
  border: none;
  padding: 1.5rem 2rem;
  border-top: 2px solid #ffe0cc;
}

/* Header Styles */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
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
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Form Styles */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #cc5500;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.label-icon {
  color: #ff8c00;
  font-size: 1rem;
}

.form-input {
  width: 100% !important;
  padding: 0.875rem 1rem !important;
  border: 2px solid #ffcc99 !important;
  border-radius: 12px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
  background: white !important;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.1) !important;
}

.form-input:focus {
  border-color: #ff8c00 !important;
  outline: none !important;
  box-shadow:
    0 0 0 4px rgba(255, 140, 0, 0.15),
    0 4px 12px rgba(255, 140, 0, 0.2) !important;
  transform: translateY(-1px) !important;
}

.form-input::placeholder {
  color: #ffb366 !important;
  font-style: italic;
}

/* Footer Styles */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;
}

.cancel-button {
  background: linear-gradient(135deg, #f5f5f5, #e9e9e9) !important;
  color: #666 !important;
  border: 2px solid #ddd !important;
  border-radius: 10px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1) !important;
}

.cancel-button:hover {
  background: linear-gradient(135deg, #e9e9e9, #ddd) !important;
  border-color: #bbb !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15) !important;
}

.save-button {
  background: linear-gradient(135deg, #ff8c00, #ff7700) !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(255, 140, 0, 0.4) !important;
  position: relative;
  overflow: hidden;
}

.save-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.save-button:hover::before {
  left: 100%;
}

.save-button:hover {
  background: linear-gradient(135deg, #ff7700, #ff6600) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 6px 20px rgba(255, 140, 0, 0.5) !important;
}

.save-button:active {
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 10px rgba(255, 140, 0, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  :deep(.proveedor-dialog .p-dialog) {
    width: 95vw !important;
    max-width: 95vw !important;
    margin: 1rem;
  }

  :deep(.proveedor-dialog .p-dialog-content) {
    padding: 1.5rem;
  }

  :deep(.proveedor-dialog .p-dialog-header) {
    padding: 1rem 1.5rem;
  }

  :deep(.proveedor-dialog .p-dialog-footer) {
    padding: 1rem 1.5rem;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .form-container {
    gap: 1.25rem;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .cancel-button,
  .save-button {
    width: 100%;
    justify-content: center;
  }
}

/* Animation for dialog entrance */
:deep(.proveedor-dialog .p-dialog) {
  animation: slideInFromTop 0.4s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Focus trap styling */
.form-input:focus + .form-label {
  color: #ff8c00;
}

/* Validation states (optional) */
.form-input.error {
  border-color: #f44336 !important;
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.15) !important;
}

.form-input.success {
  border-color: #4caf50 !important;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15) !important;
}
</style>
