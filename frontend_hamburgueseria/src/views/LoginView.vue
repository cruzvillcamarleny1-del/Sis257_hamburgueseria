<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'

const usuario = ref('')
const clave = ref('')
const error = ref(false)
const loading = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  loading.value = true
  error.value = false

  authStore
    .login(usuario.value, clave.value)
    .catch(() => {
      error.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:@/assets/images/bg_1.jpg'
}
</script>

<template>
  <div class="login-container">
    <div class="login-background"></div>
    <div class="login-content">
      <!-- Sección del formulario (izquierda) -->
      <div class="login-section">
        <Card class="login-card">
          <template #header>
            <div class="pizza-header">
              <h1 class="login-title">Pizzeria</h1>
              <h1 class="login-title">Fusión de Sabores</h1>
              <p class="login-subtitle" style="color: white">Auténtica Pizza</p>
            </div>
          </template>

          <template #content>
            <form @submit.prevent="onSubmit" class="login-form">
              <div class="field">
                <label for="usuario" class="field-label">
                  <i class="pi pi-user"></i>
                  Usuario
                </label>
                <InputText
                  id="usuario"
                  v-model="usuario"
                  placeholder="Ingresa tu usuario"
                  class="w-full"
                  :class="{ 'p-invalid': error }"
                  autofocus
                />
              </div>

              <div class="field">
                <label for="clave" class="field-label">
                  <i class="pi pi-lock"></i>
                  Contraseña
                </label>
                <Password
                  id="clave"
                  v-model="clave"
                  placeholder="Ingresa tu contraseña"
                  class="w-full"
                  :class="{ 'p-invalid': error }"
                  :feedback="false"
                  toggleMask
                />
              </div>

              <Message v-if="error" severity="error" class="login-error">
                <i class="pi pi-exclamation-triangle"></i>
                Usuario y/o contraseña incorrectos
              </Message>

              <Button
                type="submit"
                class="login-button w-full"
                :loading="loading"
                :disabled="!usuario || !clave"
              >
                <i class="pi pi-sign-in"></i>
                <span class="ml-2">Ingresar al Sistema</span>
              </Button>
            </form>
          </template>

          <template #footer>
            <div class="login-footer">
              <i class="pi pi-shield-check"></i>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sección de la imagen (derecha) -->
      <div class="image-section">
        <div class="image-container">
          <!-- Aquí va tu imagen desde el ordenador -->
          <img
            src="@/assets/images/pizza-20.jpg"
            alt="Deliciosa Pizza Italiana"
            class="hero-image"
            @error="handleImageError"
          />
          <div class="image-overlay">
            <h2 class="image-title">¡La mejor pizza de la ciudad!</h2>
            <p class="image-subtitle">Desde 2005 deleitando paladares</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(139, 69, 19, 0.6),
    rgba(205, 92, 92, 0.4)
  );
  z-index: -1;
}

.login-content {
  display: flex;
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  min-height: 700px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

/* Sección del login (izquierda) */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(20, 20, 20, 0.95);
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(255, 69, 0, 0.3);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 69, 0, 0.1);
}

/* Sección de la imagen (derecha) */
.image-section {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #ff4500, #ff6347);
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
  padding: 3rem 2rem 2rem;
  color: white;
  text-align: center;
}

.image-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  font-family: 'Georgia', serif;
}

.image-subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.pizza-header {
  text-align: center;
  padding: 2rem 0 1rem;
  background: linear-gradient(135deg, #ff4500, #ff6347);
  margin: -1rem -1rem 0;
  border-radius: 20px 20px 0 0;
  color: white;
}

.pizza-icon {
  font-size: 3rem;
  color: #ffff00;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.login-title {
  margin: 0;
  font-size: 2.2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Georgia', serif;
}

.login-subtitle {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
  font-style: italic;
}

.login-form {
  padding: 2rem 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6347;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

:deep(.p-inputtext) {
  background: rgba(40, 40, 40, 0.8);
  border: 2px solid rgba(255, 69, 0, 0.3);
  border-radius: 10px;
  color: white;
  padding: 0.8rem 1rem;
  transition: all 0.3s ease;
  font-size: 1rem;
}

:deep(.p-inputtext:focus) {
  border-color: #ff4500;
  box-shadow: 0 0 10px rgba(255, 69, 0, 0.3);
  background: rgba(50, 50, 50, 0.9);
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}

:deep(.p-password-toggle-mask) {
  color: #ff6347;
}

.login-button {
  background: linear-gradient(135deg, #ff4500, #ff6347);
  border: none;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
}

:deep(.login-button:hover:not(:disabled)) {
  background: linear-gradient(135deg, #ff6347, #ff4500);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 69, 0, 0.4);
}

:deep(.login-button:disabled) {
  background: rgba(100, 100, 100, 0.5);
  box-shadow: none;
}

.login-error {
  margin: 1rem 0;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #fca5a5;
}

:deep(.login-error .p-message-text) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 69, 0, 0.2);
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .login-section {
    order: 2;
  }

  .image-section {
    order: 1;
    min-height: 300px;
  }

  .image-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-content {
    max-width: 100%;
    border-radius: 15px;
  }

  .login-card {
    max-width: 100%;
  }

  .login-title {
    font-size: 1.8rem;
  }

  .pizza-icon {
    font-size: 2.5rem;
  }

  .image-title {
    font-size: 1.5rem;
  }

  .image-subtitle {
    font-size: 1rem;
  }
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}

.image-section {
  animation: fadeInRight 0.8s ease-out;
}

/* Efectos hover para inputs */
:deep(.p-inputtext:hover) {
  border-color: rgba(255, 99, 71, 0.6);
}

/* Placeholder styling */
:deep(.p-inputtext::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}
</style>
