<script setup lang="ts">
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const proveedorListRef = ref<typeof ProveedorList | null>(null)
const proveedorEdit = ref<any>(null)

function handleCreate() {
  proveedorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(proveedor: any) {
  proveedorEdit.value = proveedor
  mostrarDialog.value = true
}

function handleGuardar() {
  proveedorListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="proveedor-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <i class="pi pi-users"></i>
          </div>
          <h1 class="main-title">Gestión de Proveedores</h1>
          <p class="subtitle">Administra y organiza tu red de proveedores</p>
        </div>
        <Button
          label="Nuevo Proveedor"
          icon="pi pi-plus"
          @click="handleCreate"
          class="create-button"
        />
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <div class="list-container">
        <ProveedorList ref="proveedorListRef" @edit="handleEdit" />
      </div>
    </div>

    <!-- Dialog -->
    <ProveedorSave
      :mostrar="mostrarDialog"
      :proveedor="proveedorEdit"
      :modoEdicion="!!proveedorEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.proveedor-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%);
  position: relative;
  overflow: hidden;
}

.proveedor-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(135deg, #ff8c00 0%, #ff6b35 50%, #ff4500 100%);
  z-index: 1;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
}

.header-section {
  position: relative;
  z-index: 2;
  padding: 2rem 2rem 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
}

.icon-wrapper i {
  font-size: 1.8rem;
  color: white;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.create-button {
  background: white !important;
  color: #ff6b35 !important;
  border: 3px solid white !important;
  padding: 0.75rem 2rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  border-radius: 50px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-button:hover {
  background: #ff6b35 !important;
  color: white !important;
  border-color: #ff6b35 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) !important;
}

.create-button:active {
  transform: translateY(0) !important;
}

.content-section {
  position: relative;
  z-index: 2;
  padding: 2rem;
  margin-top: 1rem;
}

.list-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.1);
  border: 2px solid rgba(255, 140, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.list-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff8c00 0%, #ff6b35 50%, #ff4500 100%);
  z-index: 1;
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

.header-content {
  animation: fadeInUp 0.8s ease-out;
}

.list-container {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .create-button {
    padding: 0.6rem 1.5rem !important;
    font-size: 0.9rem !important;
  }

  .content-section {
    padding: 1rem;
  }

  .header-section {
    padding: 1.5rem 1rem 0.5rem;
  }
}

/* Efectos adicionales */
.proveedor-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

.list-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 107, 53, 0.15);
  transition: all 0.3s ease;
}
</style>
