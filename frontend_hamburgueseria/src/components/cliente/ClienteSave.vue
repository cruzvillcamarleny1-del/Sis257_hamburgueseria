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
  <div class="pizzeria-dialog-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? '🍕 Editar Cliente' : '🍕 Nuevo Cliente'"
      class="pizzeria-dialog"
      :style="{ width: '35rem' }"
      :modal="true"
      :closable="true"
    >
      <!-- Header personalizado -->
      <template #header>
        <div class="custom-header">
          <div class="header-icon">
            <span class="pizza-emoji">🍕</span>
          </div>
          <div class="header-text">
            <h2 class="dialog-title">
              {{ props.modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}
            </h2>
            <p class="dialog-subtitle">
              {{
                props.modoEdicion
                  ? 'Actualiza la información del cliente'
                  : 'Agrega un nuevo cliente a tu pizzería'
              }}
            </p>
          </div>
        </div>
      </template>

      <!-- Contenido del formulario -->
      <div class="form-container">
        <!-- Campo Nombre -->
        <div class="form-field">
          <label for="nombre" class="form-label">
            <i class="pi pi-user label-icon"></i>
            Nombre
          </label>
          <div class="input-wrapper">
            <InputText
              id="nombre"
              v-model="cliente.nombre"
              class="pizzeria-input"
              placeholder="Ingresa el nombre..."
              autocomplete="off"
              autofocus
            />
          </div>
        </div>

        <!-- Campo Apellido -->
        <div class="form-field">
          <label for="apellido" class="form-label">
            <i class="pi pi-users label-icon"></i>
            Apellido
          </label>
          <div class="input-wrapper">
            <InputText
              id="apellido"
              v-model="cliente.apellido"
              class="pizzeria-input"
              placeholder="Ingresa el apellido..."
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Campo Teléfono -->
        <div class="form-field">
          <label for="telefono" class="form-label">
            <i class="pi pi-phone label-icon"></i>
            Teléfono
          </label>
          <div class="input-wrapper">
            <InputText
              id="telefono"
              v-model="cliente.telefono"
              class="pizzeria-input"
              placeholder="Ej: +591 12345678"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Campo Dirección -->
        <div class="form-field">
          <label for="direccion" class="form-label">
            <i class="pi pi-map-marker label-icon"></i>
            Dirección
          </label>
          <div class="input-wrapper">
            <InputText
              id="direccion"
              v-model="cliente.direccion"
              class="pizzeria-input"
              placeholder="Dirección de entrega..."
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <!-- Footer con botones -->
      <template #footer>
        <div class="dialog-footer">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            class="cancel-btn"
            @click="dialogVisible = false"
          />
          <Button
            type="button"
            label="Guardar"
            icon="pi pi-save"
            class="save-btn"
            @click="handleSave"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.pizzeria-dialog-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Estilos del Dialog principal */
:deep(.pizzeria-dialog) {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 25px 50px rgba(255, 107, 53, 0.3) !important;
  border: 3px solid #ffe4d6 !important;
}

:deep(.pizzeria-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%) !important;
  border: none !important;
  padding: 0 !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.pizzeria-dialog .p-dialog-header::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(255,255,255,0.1)"/></svg>')
    repeat;
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

:deep(.pizzeria-dialog .p-dialog-content) {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee6 100%) !important;
  padding: 2.5rem !important;
  border: none !important;
}

:deep(.pizzeria-dialog .p-dialog-footer) {
  background: white !important;
  border-top: 3px solid #ffe4d6 !important;
  padding: 1.5rem 2.5rem !important;
}

/* Header personalizado */
.custom-header {
  display: flex;
  align-items: center;
  padding: 2rem;
  color: white;
  position: relative;
  z-index: 1;
}

.header-icon {
  margin-right: 1.5rem;
}

.pizza-emoji {
  font-size: 3rem;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  40% {
    transform: translateY(-8px) rotate(-5deg);
  }
  60% {
    transform: translateY(-4px) rotate(5deg);
  }
}

.header-text {
  flex: 1;
}

.dialog-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.dialog-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Contenedor del formulario */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Campos del formulario */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #ff6b35;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  color: #ff8c42;
}

.input-wrapper {
  position: relative;
}

/* Estilos de inputs */
:deep(.pizzeria-input) {
  width: 100% !important;
  padding: 1rem 1.25rem !important;
  border: 2px solid #ffe4d6 !important;
  border-radius: 12px !important;
  font-size: 1rem !important;
  background: white !important;
  color: #333 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1) !important;
}

:deep(.pizzeria-input:focus) {
  border-color: #ff6b35 !important;
  box-shadow:
    0 0 0 3px rgba(255, 107, 53, 0.2),
    0 4px 12px rgba(255, 107, 53, 0.15) !important;
  outline: none !important;
  transform: translateY(-1px) !important;
}

:deep(.pizzeria-input:hover) {
  border-color: #ff8c42 !important;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15) !important;
}

/* Footer del dialog */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Botón Cancelar */
:deep(.cancel-btn) {
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%) !important;
  border: none !important;
  color: white !important;
  padding: 0.875rem 2rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3) !important;
}

:deep(.cancel-btn:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4) !important;
  filter: brightness(1.1) !important;
}

/* Botón Guardar */
:deep(.save-btn) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%) !important;
  border: none !important;
  color: white !important;
  padding: 0.875rem 2rem !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4) !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.save-btn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

:deep(.save-btn:hover::before) {
  left: 100%;
}

:deep(.save-btn:hover) {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.5) !important;
  filter: brightness(1.1) !important;
}

:deep(.save-btn:active) {
  transform: translateY(0) scale(0.98) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  :deep(.pizzeria-dialog) {
    width: 95vw !important;
    max-width: 95vw !important;
  }

  .custom-header {
    padding: 1.5rem;
  }

  .dialog-title {
    font-size: 1.5rem;
  }

  .pizza-emoji {
    font-size: 2.5rem;
  }

  :deep(.pizzeria-dialog .p-dialog-content) {
    padding: 1.5rem !important;
  }

  .form-container {
    gap: 1.5rem;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  :deep(.cancel-btn),
  :deep(.save-btn) {
    width: 100% !important;
    justify-content: center !important;
  }
}

/* Animaciones de entrada */
:deep(.pizzeria-dialog) {
  animation: dialogEnter 0.4s ease-out;
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Efectos adicionales */
.form-field {
  animation: slideInUp 0.3s ease-out forwards;
  opacity: 0;
}

.form-field:nth-child(1) {
  animation-delay: 0.1s;
}
.form-field:nth-child(2) {
  animation-delay: 0.2s;
}
.form-field:nth-child(3) {
  animation-delay: 0.3s;
}
.form-field:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideInUp {
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
