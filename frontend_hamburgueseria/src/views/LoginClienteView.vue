<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import http from '@/plugins/axios'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function loginCliente() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Completa email y contraseña.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await http.post('/clientes/login-web', {
      email: email.value,
      password: password.value,
    })

    if (!data?.token) throw new Error('Respuesta inválida.')

    localStorage.setItem('cliente_token', data.token)
    localStorage.setItem('rol', 'cliente')
    if (data.cliente) {
      localStorage.setItem('cliente_data', JSON.stringify(data.cliente))
      if (data.cliente.id) {
        localStorage.setItem('id_cliente', String(data.cliente.id))
      }
      const nombreCompleto = [data.cliente.nombre, data.cliente.apellido]
        .filter(Boolean)
        .join(' ')
        .trim()
      localStorage.setItem('nombre_cliente', nombreCompleto || 'Cliente')
    }

    window.dispatchEvent(new CustomEvent('cliente-session-changed'))
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Credenciales incorrectas.'
  } finally {
    loading.value = false
  }
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
      <div class="login-section">
        <div class="login-card">
          <div class="burger-header">
            <div class="logo-circle">
              <i class="pi pi-heart"></i>
            </div>
            <h1 class="login-title">Clientes VIP</h1>
            <h1 class="login-title accent">Disfruta tus pedidos</h1>
          </div>

          <form @submit.prevent="loginCliente" class="login-form">
            <div class="field">
              <label for="email" class="field-label">
                <i class="pi pi-envelope"></i>
                Email
              </label>
              <input
                id="email"
                v-model="email"
                class="styled-input"
                type="email"
                placeholder="cliente@correo.com"
              />
            </div>

            <div class="field">
              <label for="password" class="field-label">
                <i class="pi pi-lock"></i>
                Contraseña
              </label>
              <input
                id="password"
                v-model="password"
                class="styled-input"
                type="password"
                placeholder="********"
              />
            </div>

            <p v-if="errorMessage" class="login-error">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errorMessage }}
            </p>

            <button class="login-button" type="submit" :disabled="loading">
              <i class="pi pi-sign-in"></i>
              {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
            </button>

            <router-link to="/register-cliente" class="link-small">
              ¿Eres nuevo? Regístrate aquí
            </router-link>
            <router-link to="/login" class="link-small emphasis">
              ¿Eres empleado? Inicia aquí
            </router-link>
          </form>
        </div>
      </div>

      <div class="image-section">
        <div class="image-decoration"></div>
        <div class="image-container">
          <img
            src="@/assets/images/ham2.jpg"
            alt="Hamburguesa"
            class="hero-image"
            @error="handleImageError"
          />
          <div class="floating-item f1">
            <i class="pi pi-circle-on"></i>
          </div>
          <div class="floating-item f2">
            <i class="pi pi-fire"></i>
          </div>
          <div class="floating-item f3">
            <i class="pi pi-star"></i>
          </div>
          <div class="hero-overlay-text">
            <h2 class="image-title">Pedidos express</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Paleta y layout idénticos a LoginView */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 2vw, 1.5rem);
  background:
    radial-gradient(circle at 15% 85%, rgba(255, 190, 51, 0.15) 0%, transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(215, 35, 35, 0.15) 0%, transparent 55%),
    linear-gradient(135deg, #1d1f21 0%, #2a2e32 50%, #1d1f21 100%);
  overflow: hidden;
  position: relative;
}
.login-background {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(125deg, rgba(255, 190, 51, 0.05), rgba(63, 163, 77, 0.05)),
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0 10px, transparent 10px 20px);
  pointer-events: none;
}
.login-content {
  display: flex;
  width: 100%;
  max-width: 1400px;
  min-height: 720px;
  background: rgba(34, 36, 38, 0.6);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 190, 51, 0.15);
  border-radius: 28px;
  overflow: hidden;
  box-shadow:
    0 25px 60px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 190, 51, 0.15);
  position: relative;
}
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 3vw, 3rem);
}
.login-card {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(165deg, #25282b 0%, #1d1f21 90%);
  border: 1px solid rgba(255, 190, 51, 0.18);
  border-radius: 24px;
  box-shadow:
    0 15px 45px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 190, 51, 0.15),
    0 0 40px -5px rgba(255, 190, 51, 0.25);
  overflow: hidden;
  position: relative;
}
.burger-header {
  text-align: center;
  padding: 2.2rem 1.5rem 1.7rem;
  background: linear-gradient(135deg, #2a2e32 0%, #1d1f21 60%);
  position: relative;
}
.burger-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(255, 190, 51, 0.15) 0%, transparent 55%),
    radial-gradient(circle at 75% 65%, rgba(215, 35, 35, 0.12) 0%, transparent 60%);
  pointer-events: none;
}
.logo-circle {
  width: 70px;
  height: 70px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffbe33, #ffd666 55%, #ffbe33);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d1f21;
  font-size: 1.6rem;
  font-weight: 700;
  box-shadow:
    0 8px 25px rgba(255, 190, 51, 0.55),
    inset 0 0 0 4px rgba(255, 246, 217, 0.6);
  position: relative;
}
.login-title {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(90deg, #fff6d9, #ffbe33 60%, #ffd666);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
}
.login-title.accent {
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  margin-top: 0.25rem;
  background: linear-gradient(90deg, #ffbe33, #d72323);
  -webkit-background-clip: text;
  color: transparent;
}
.login-form {
  padding: 1.5rem 1.7rem 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
  color: #ffbe33;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
.field-label i {
  color: #d72323;
}
.styled-input {
  background: linear-gradient(145deg, #2a2e32, #24272a);
  border: 2px solid rgba(255, 190, 51, 0.35);
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  color: #fff6d9;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow:
    0 4px 12px -3px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 190, 51, 0.15);
  transition: all 0.25s ease;
}
.styled-input:focus {
  border-color: #ffbe33;
  box-shadow:
    0 0 0 3px rgba(255, 190, 51, 0.25),
    0 8px 20px -5px rgba(255, 190, 51, 0.5);
  outline: none;
  background: linear-gradient(145deg, #2f3337, #2a2e32);
}
.login-button {
  background: linear-gradient(135deg, #ffbe33 0%, #ffb400 35%, #d72323 100%);
  color: #1d1f21;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  padding: 0.95rem 1.4rem;
  font-size: 1rem;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-shadow:
    0 10px 30px -5px rgba(215, 35, 35, 0.45),
    0 4px 15px -3px rgba(255, 190, 51, 0.55);
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.login-button:disabled {
  background: linear-gradient(135deg, #555, #333);
  color: #999;
  box-shadow: none;
  cursor: not-allowed;
}
.login-error {
  background: rgba(215, 35, 35, 0.08);
  border: 1px solid rgba(215, 35, 35, 0.35);
  color: #ff9e9e;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.link-small {
  font-size: 0.75rem;
  color: #ffd666;
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 0.5px;
}
.link-small:hover {
  color: #ffbe33;
}
.image-section {
  flex: 1.1;
  position: relative;
  background: linear-gradient(135deg, #1d1f21, #2a2e32 60%, #1d1f21);
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}
.image-decoration {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 70% 30%, rgba(255, 190, 51, 0.18) 0%, transparent 60%),
    radial-gradient(circle at 30% 70%, rgba(215, 35, 35, 0.15) 0%, transparent 60%);
  mix-blend-mode: screen;
  pointer-events: none;
}
.image-container {
  width: 100%;
  position: relative;
  display: flex;
  alignments: flex-end;
  justify-content: center;
  padding: 2.5rem 2rem;
}
.hero-image {
  max-width: 100%;
  border-radius: 22px;
  box-shadow:
    0 25px 60px -15px rgba(0, 0, 0, 0.65),
    0 0 0 1px rgba(255, 190, 51, 0.12);
}
.hero-overlay-text {
  text-align: center;
  background: rgba(29, 31, 33, 0.72);
  backdrop-filter: blur(6px);
  padding: 1.6rem 2rem 1.4rem;
  border: 1px solid rgba(255, 190, 51, 0.25);
  border-radius: 22px;
  width: min(90%, 580px);
  box-shadow:
    0 12px 40px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 190, 51, 0.15);
  position: relative;
  overflow: hidden;
}
.hero-overlay-text::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(140deg, rgba(255, 190, 51, 0.15), transparent 60%),
    linear-gradient(45deg, rgba(215, 35, 35, 0.12), transparent 55%);
  pointer-events: none;
}
.image-title {
  margin: 0;
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(90deg, #ffbe33, #ffd666, #fff6d9);
  -webkit-background-clip: text;
  color: transparent;
}
.image-subtitle {
  margin: 0.7rem 0 0;
  font-size: clamp(0.85rem, 2vw, 1.05rem);
  color: #ffd666;
  letter-spacing: 1px;
}
.floating-item {
  position: absolute;
  color: #ffbe33;
  opacity: 0.35;
  filter: drop-shadow(0 0 6px rgba(255, 190, 51, 0.4));
  animation: float 7s ease-in-out infinite;
}
.f1 {
  top: 12%;
  left: 18%;
  font-size: 3.5rem;
  animation-delay: 0s;
}
.f2 {
  top: 30%;
  right: 14%;
  font-size: 2.8rem;
  color: #d72323;
  animation-delay: 2.2s;
}
.f3 {
  bottom: 22%;
  left: 12%;
  font-size: 4.2rem;
  color: #3fa34d;
  animation-delay: 4.4s;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-22px) rotate(6deg);
  }
}
@media (max-width: 1100px) {
  .login-content {
    flex-direction: column;
    min-height: auto;
  }
  .image-section {
    min-height: 360px;
  }
  .login-section {
    padding: 2rem 1.25rem;
  }
  .hero-overlay-text {
    width: 90%;
  }
}
@media (max-width: 680px) {
  .logo-circle {
    width: 60px;
    height: 60px;
    font-size: 1.3rem;
  }
  .login-card {
    max-width: 100%;
  }
  .login-form {
    padding: 1.2rem 1.2rem 1.6rem;
  }
}
@media (max-width: 460px) {
  .login-content {
    border-radius: 20px;
  }
  .burger-header {
    padding: 1.7rem 1rem 1.4rem;
  }
  .floating-item {
    display: none;
  }
}
</style>
