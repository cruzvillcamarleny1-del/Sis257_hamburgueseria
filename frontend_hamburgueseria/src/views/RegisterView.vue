<script setup lang="ts">
import { ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const nombre = ref('')
const apellido = ref('')
const ci = ref('')
const telefono = ref('')
const direccion = ref('')
const email = ref('')
const password = ref('')
const advertencia = ref('')

async function registrarCliente() {
  if (!nombre.value || !apellido.value || !email.value || !password.value) {
    advertencia.value = 'Completa todos los campos obligatorios.'
    setTimeout(() => (advertencia.value = ''), 2000)
    return
  }
  try {
    const body = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      ci: ci.value.trim(),
      telefono: telefono.value.trim(),
      direccion: direccion.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value.trim(),
    }
    await http.post('/clientes/register-web', body)
    advertencia.value = '¡Registro exitoso! Ahora inicia sesión.'
    setTimeout(() => {
      advertencia.value = ''
      router.push('/login')
    }, 1800)
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      advertencia.value = Array.isArray(e.response.data.message)
        ? e.response.data.message.join(', ')
        : e.response.data.message
    } else {
      advertencia.value = 'Error al registrar. Intenta con otro email.'
    }
    setTimeout(() => (advertencia.value = ''), 3000)
  }
}
</script>

<template>
  <div class="register-bg">
    <div class="register-card">
      <div class="burger-header">
        <div class="logo-circle">🍔</div>
        <h2 class="login-title">Registro de Cliente</h2>
        <div class="login-title accent">¡Crea tu cuenta y pide online!</div>
        <div class="login-subtitle">Completa tus datos para registrarte</div>
      </div>
      <form @submit.prevent="registrarCliente" class="register-form">
        <div v-if="advertencia" class="login-error">{{ advertencia }}</div>
        <div class="fields-row">
          <div class="field">
            <label class="field-label yellow-label">Nombre *</label>
            <input v-model="nombre" class="styled-input" placeholder="Nombre" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">Apellido *</label>
            <input v-model="apellido" class="styled-input" placeholder="Apellido" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">CI</label>
            <input v-model="ci" class="styled-input" placeholder="CI" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">Teléfono</label>
            <input v-model="telefono" class="styled-input" placeholder="Teléfono" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">Dirección</label>
            <input v-model="direccion" class="styled-input" placeholder="Dirección" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">Email *</label>
            <input v-model="email" class="styled-input" placeholder="Email" type="email" />
          </div>
          <div class="field">
            <label class="field-label yellow-label">Contraseña *</label>
            <input
              v-model="password"
              type="password"
              class="styled-input"
              placeholder="Contraseña"
            />
          </div>
        </div>
        <button type="submit" class="login-button">Registrarse</button>
        <div class="extra-links">
          <router-link to="/login" class="link-small">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 15% 85%, rgba(255, 190, 51, 0.15) 0%, transparent 55%),
    radial-gradient(circle at 85% 15%, rgba(215, 35, 35, 0.15) 0%, transparent 55%),
    linear-gradient(135deg, #1d1f21 0%, #2a2e32 50%, #1d1f21 100%);
  padding: 2rem;
}

.register-card {
  max-width: 520px;
  min-height: 0;
  padding-bottom: 1rem;
}

.burger-header {
  padding: 1.2rem 1.5rem 0.7rem;
}

.logo-circle {
  width: 60px;
  height: 60px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffbe33, #fab802 55%, #ffbe33);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d1f21;
  font-size: 1.3rem;
  font-weight: 700;
  box-shadow:
    0 8px 25px rgba(255, 190, 51, 0.55),
    inset 0 0 0 4px rgba(255, 246, 217, 0.6);
  position: relative;
}

.login-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(90deg, #fff6d9, #ffbe33 60%, #fab802);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
}
.login-title.accent {
  font-size: 1.3rem;
  margin-top: 0.25rem;
  background: linear-gradient(90deg, #ffbe33, #d72323);
  -webkit-background-clip: text;
  color: transparent;
}
.login-subtitle {
  margin: 0.7rem 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffbe33;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.register-form {
  padding: 1rem 1.2rem 0.2rem;
  gap: 0.7rem;
}

.field {
  display: flex;
  flex-direction: column;
  min-width: 160px;
  max-width: 200px;
  flex: 1 1 180px;
}

.field-label {
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
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
.styled-input::placeholder {
  color: rgba(255, 246, 217, 0.5);
  font-style: italic;
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
.login-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow:
    0 16px 40px -8px rgba(215, 35, 35, 0.55),
    0 8px 20px -3px rgba(255, 190, 51, 0.6);
  filter: brightness(1.08);
}
.login-button:active:not(:disabled) {
  transform: translateY(-1px);
}
.login-button:disabled {
  background: linear-gradient(135deg, #555, #333);
  color: #999;
  box-shadow: none;
  cursor: not-allowed;
}
.extra-links {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.4rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.link-small {
  font-size: 0.75rem;
  color: #ffbe33;
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 0.5px;
}
.link-small:hover {
  color: #ffbe33;
}
.login-error {
  background: rgba(215, 35, 35, 0.08);
  border: 1px solid rgba(215, 35, 35, 0.35);
  color: #ff9e9e;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  box-shadow: 0 6px 18px -6px rgba(215, 35, 35, 0.4);
}
@media (max-width: 600px) {
  .register-card {
    max-width: 98vw;
    border-radius: 16px;
    padding: 0.5rem;
  }
  .burger-header {
    padding: 1.2rem 0.7rem 0.7rem;
  }
  .register-form {
    padding: 0.7rem 0.7rem 0.2rem;
  }
}

.fields-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 1.2rem;
}
@media (max-width: 700px) {
  .fields-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
.fields-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 1.2rem;
}
.yellow-label {
  color: #ffbe33;
  font-weight: 700;
  font-size: 0.98rem;
  margin-bottom: 0.25rem;
}

@media (max-width: 900px) {
  .fields-row {
    flex-direction: column;
    gap: 0.8rem;
  }
  .field {
    max-width: 100%;
  }
}
</style>
