<script setup lang="ts">
import ProductoList from '@/components/producto/ProductoList.vue'
import ProductoSave from '@/components/producto/ProductoSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const productoListRef = ref<typeof ProductoList | null>(null)
const productoEdit = ref<any>(null)

function handleCreate() {
  productoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(producto: any) {
  productoEdit.value = {
    ...producto,
    precio: Number(producto.precio ?? 0),
  }
  mostrarDialog.value = true
}

function handleGuardar() {
  productoListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <div class="productos-container">
    <!-- Header con diseño atractivo -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <i class="pi pi-bookmark header-icon"></i>
          <h1 class="main-title">Productos</h1>
          <p class="subtitle">Administra el menú de tu hamburguesería</p>
        </div>
        <div class="action-wrapper">
          <Button
            label="Crear Producto"
            icon="pi pi-plus"
            @click="handleCreate"
            class="create-button"
            size="large"
          />
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="content-card">
        <ProductoList ref="productoListRef" @edit="handleEdit" />
      </div>
    </div>

    <!-- Modal de guardado -->
    <ProductoSave
      :mostrar="mostrarDialog"
      :producto="productoEdit"
      :modoEdicion="!!productoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />

    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <div class="burger-icon icon-1">🍔</div>
      <div class="burger-icon icon-2">🍟</div>
      <div class="burger-icon icon-3">🥤</div>
    </div>
  </div>
</template>

<style scoped>
.productos-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #222831 0%,
    #393e46 25%,
    #222831 50%,
    #393e46 75%,
    #222831 100%
  );
  position: relative;
  overflow-x: hidden;
}

.productos-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.header-section {
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 2;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.title-wrapper {
  flex: 1;
  min-width: 300px;
}

.header-icon {
  font-size: 2.5rem;
  color: #ffbe33;
  margin-bottom: 1rem;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  color: #eeeeee;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 190, 51, 0.9);
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.action-wrapper {
  flex-shrink: 0;
}

.create-button {
  background: linear-gradient(45deg, #ffbe33 0%, #ffa500 100%) !important;
  border: none !important;
  color: #222831 !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  padding: 1rem 2rem !important;
  border-radius: 50px !important;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.3),
    0 4px 10px rgba(255, 190, 51, 0.4) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-button:hover {
  transform: translateY(-3px) !important;
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.4),
    0 6px 15px rgba(255, 190, 51, 0.6) !important;
  background: linear-gradient(45deg, #ffa500 0%, #ffbe33 100%) !important;
}

.create-button:active {
  transform: translateY(-1px) !important;
}

.main-content {
  padding: 0 1.5rem 2rem;
  position: relative;
  z-index: 2;
}

.content-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(238, 238, 238, 0.98);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 8px 20px rgba(255, 190, 51, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 190, 51, 0.2);
  overflow: hidden;
  position: relative;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffbe33 0%, #ffa500 50%, #ffbe33 100%);
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.burger-icon {
  position: absolute;
  font-size: 4rem;
  opacity: 0.5;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(2px 2px 8px rgba(255, 190, 51, 0.5));
  text-shadow: 0 0 20px rgba(255, 190, 51, 0.6);
}

.icon-1 {
  top: 20%;
  left: 2%;
  animation-delay: 0s;
}

.icon-2 {
  top: 60%;
  right: 2%;
  animation-delay: 2s;
  font-size: 3rem;
}

.icon-3 {
  bottom: 1%;
  left: 5%;
  animation-delay: 4s;
  font-size: 5rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .title-wrapper {
    min-width: auto;
  }

  .main-title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .create-button {
    font-size: 1rem !important;
    padding: 0.8rem 1.5rem !important;
  }

  .burger-icon {
    font-size: 2.5rem;
  }

  .icon-3 {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 1.5rem 1rem;
  }

  .main-content {
    padding: 0 1rem 1.5rem;
  }

  .main-title {
    font-size: 1.8rem;
  }

  .content-card {
    border-radius: 15px;
  }
}

/* Animaciones adicionales */
@keyframes slideInFromTop {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  animation: slideInFromTop 0.8s ease-out;
}

.content-card {
  animation: slideInFromBottom 0.8s ease-out 0.2s both;
}

/* Efectos hover para mejorar la interactividad */
.content-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.35),
    0 10px 25px rgba(255, 190, 51, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
