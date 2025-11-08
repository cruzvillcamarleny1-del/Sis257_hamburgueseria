<script setup lang="ts">
import ClienteList from '@/components/cliente/ClienteList.vue'
import ClienteSave from '@/components/cliente/ClienteSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const clienteListRef = ref<typeof ClienteList | null>(null)
const clienteEdit = ref<any>(null)

function handleCreate() {
  clienteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(cliente: any) {
  clienteEdit.value = cliente
  mostrarDialog.value = true
}

function handleGuardar() {
  clienteListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="pizzeria-container">
    <!-- Header con diseño de pizzería -->
    <div class="header-section">
      <div class="pizza-icon">🍕</div>
      <h1 class="main-title">Gestión de Clientes</h1>
      <p class="subtitle">Administra tus clientes de manera fácil y rápida</p>
    </div>

    <!-- Botón de crear con estilo pizzería -->
    <div class="action-section">
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="handleCreate" class="create-button" />
    </div>

    <!-- Lista de clientes centrada -->
    <div class="content-section">
      <ClienteList ref="clienteListRef" @edit="handleEdit" class="cliente-list-centered" />
    </div>

    <!-- Modal de guardar -->
    <ClienteSave
      :mostrar="mostrarDialog"
      :cliente="clienteEdit"
      :modoEdicion="!!clienteEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.pizzeria-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8f0 0%, #ffeee6 50%, #ffe4d6 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header con tema de pizzería */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
  color: white;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pizza-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-weight: 300;
  position: relative;
  z-index: 1;
}

/* Sección de acciones */
.action-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.create-button {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 25px !important;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4) !important;
  transition: all 0.3s ease !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.create-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6) !important;
  filter: brightness(1.1) !important;
}

.create-button:active {
  transform: translateY(0) !important;
}

/* Contenido principal centrado */
.content-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.1);
  border: 2px solid #ffe4d6;
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos globales para centrar tablas - Estilo Simple */
:deep(.p-datatable) {
  margin: 0 auto;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

:deep(.p-datatable-header) {
  display: none !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: transparent !important;
  color: #666666 !important;
  font-weight: 600 !important;
  text-align: left !important;
  padding: 1rem !important;
  border: none !important;
  border-bottom: 2px solid #e0e0e0 !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  font-size: 1rem !important;
}

:deep(.p-datatable-tbody > tr > td) {
  text-align: left !important;
  padding: 1rem !important;
  border: none !important;
  border-bottom: 1px solid #f0f0f0 !important;
  background: transparent !important;
  transition: background-color 0.3s ease !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa !important;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background-color: transparent !important;
}

/* Botones de acción en la tabla - Estilo Simple */
:deep(.p-button) {
  margin: 0 0.25rem !important;
  border-radius: 4px !important;
  padding: 0.4rem 0.8rem !important;
  font-size: 0.85rem !important;
  transition: all 0.2s ease !important;
  border: 1px solid #ddd !important;
  background: white !important;
  color: #666 !important;
}

:deep(.p-button:hover) {
  background: #f5f5f5 !important;
  border-color: #ccc !important;
  transform: none !important;
  box-shadow: none !important;
}

:deep(.p-button-info) {
  background: white !important;
  border: 1px solid #ddd !important;
  color: #666 !important;
}

:deep(.p-button-info:hover) {
  background: #f5f5f5 !important;
  border-color: #ccc !important;
  transform: none !important;
  box-shadow: none !important;
}

:deep(.p-button-danger) {
  background: white !important;
  border: 1px solid #ddd !important;
  color: #d32f2f !important;
}

:deep(.p-button-danger:hover) {
  background: #fef2f2 !important;
  border-color: #d32f2f !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .pizzeria-container {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .pizza-icon {
    font-size: 3rem;
  }

  .content-section {
    padding: 1rem;
  }

  .create-button {
    width: 100% !important;
    max-width: 300px !important;
  }
}

/* Animaciones adicionales */
.cliente-list-centered {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos de hover para el contenedor principal */
.content-section:hover {
  box-shadow: 0 6px 25px rgba(255, 107, 53, 0.15);
  transition: box-shadow 0.3s ease;
}
</style>
