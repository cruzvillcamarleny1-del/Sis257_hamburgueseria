<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'clientes'
const props = defineProps({
  mostrar: Boolean,
  cliente: {
    type: Object as () => Cliente,
    default: () => ({}) as Cliente,
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

const cliente = ref<Cliente>({ ...props.cliente })
watch(
  () => props.cliente,
  (newVal) => {
    cliente.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: cliente.value.nombre,
      apellido: cliente.value.apellido,
      telefono: cliente.value.telefono,
      direccion: cliente.value.direccion,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${cliente.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    cliente.value = {} as Cliente
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
      :header="props.modoEdicion ? 'Editar Cliente' : 'Crear Cliente'"
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
            {{ props.modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h3>
        </div>
      </template>

      <div class="dialog-content">
        <!-- Campo Nombre -->
        <div class="field-container">
          <label for="nombre" class="field-label">
            <i class="pi pi-user field-icon"></i>
            Nombre
          </label>
          <div class="input-wrapper">
            <InputText
              id="nombre"
              v-model="cliente.nombre"
              class="styled-input"
              placeholder="Ingresa el nombre..."
              autocomplete="off"
              autofocus
            />
          </div>
        </div>

        <!-- Campo Apellido -->
        <div class="field-container">
          <label for="apellido" class="field-label">
            <i class="pi pi-users field-icon"></i>
            Apellido
          </label>
          <div class="input-wrapper">
            <InputText
              id="apellido"
              v-model="cliente.apellido"
              class="styled-input"
              placeholder="Ingresa el apellido..."
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Campo Teléfono -->
        <div class="field-container">
          <label for="telefono" class="field-label">
            <i class="pi pi-phone field-icon"></i>
            Teléfono
          </label>
          <div class="input-wrapper">
            <InputText
              id="telefono"
              v-model="cliente.telefono"
              class="styled-input"
              placeholder="Ej: +591 12345678"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Campo Dirección -->
        <div class="field-container">
          <label for="direccion" class="field-label">
            <i class="pi pi-map-marker field-icon"></i>
            Dirección
          </label>
          <div class="input-wrapper">
            <InputText
              id="direccion"
              v-model="cliente.direccion"
              class="styled-input"
              placeholder="Dirección de entrega..."
              autocomplete="off"
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
            :label="props.modoEdicion ? 'Actualizar' : 'Guardar'"
            :icon="props.modoEdicion ? 'pi pi-check' : 'pi pi-save'"
            class="btn-guardar"
            @click="handleSave"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
// ...existing code...
<style scoped>
.dialog-container {
  position: relative;
}

/* Estilos del Dialog - Fondo blanco (ProductoSave) */
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

/* Header personalizado */
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

/* Inputs oscuros (ProductoSave) */
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
:deep(.styled-input::placeholder) {
  color: #999 !important;
  font-style: italic !important;
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

/* Animación */
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
