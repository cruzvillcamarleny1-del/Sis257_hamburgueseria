<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'

const showGestion = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const isHeaderHidden = ref(false)
let lastScrollY = window.scrollY

function handleScroll() {
  const threshold = 200 // Cambia este valor para ajustar cuándo se oculta
  if (window.scrollY > lastScrollY && window.scrollY > threshold) {
    isHeaderHidden.value = true
  } else {
    isHeaderHidden.value = false
  }
  lastScrollY = window.scrollY
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <!-- header section strats -->
    <header class="header_section">
      <div class="container">
        <nav class="navbar navbar-expand-lg custom_nav-container">
          <router-link class="navbar-brand" :to="{ path: '/', hash: '#home' }">
            <span> Hamburguesería </span>
          </router-link>

          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class=""> </span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <router-link class="nav-link" :to="{ path: '/', hash: '#home' }">Inicio</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ path: '/', hash: '#food' }">Menu</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ path: '/', hash: '#about' }"
                  >Acerca</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ path: '/', hash: '#book' }"
                  >Tabla de Reservas</router-link
                >
              </li>

              <!-- Dropdown Gestión solo si está logeado -->
              <li v-if="authStore.token" class="nav-item gestion-dropdown">
                <a
                  class="nav-link gestion-toggle"
                  href="#"
                  @click.prevent="showGestion = !showGestion"
                  :class="{ active: showGestion }"
                >
                  <i class="fa fa-cogs"></i> Gestión <i class="fa fa-caret-down"></i>
                </a>
                <div v-show="showGestion" class="gestion-menu animated-dropdown">
                  <router-link class="gestion-item" :to="{ name: 'producto' }">
                    <i class="fa fa-cutlery"></i> Productos
                  </router-link>
                  <router-link class="gestion-item" :to="{ name: 'ventas' }">
                    <i class="fa fa-shopping-cart"></i> Ventas
                  </router-link>
                  <router-link class="gestion-item" :to="{ name: 'proveedor' }">
                    <i class="fa fa-truck"></i> Proveedores
                  </router-link>
                  <router-link class="gestion-item" :to="{ name: 'cliente' }">
                    <i class="fa fa-users"></i> Clientes
                  </router-link>
                </div>
              </li>
            </ul>
            <div class="user_option">
              <a class="cart_link" href="#">
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 456.029 456.029"
                  style="enable-background: new 0 0 456.029 456.029"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <path
                        d="M345.6,338.862c-29.184,0-53.248,23.552-53.248,53.248c0,29.184,23.552,53.248,53.248,53.248
                   c29.184,0,53.248-23.552,53.248-53.248C398.336,362.926,374.784,338.862,345.6,338.862z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M439.296,84.91c-1.024,0-2.56-0.512-4.096-0.512H112.64l-5.12-34.304C104.448,27.566,84.992,10.67,61.952,10.67H20.48
                   C9.216,10.67,0,19.886,0,31.15c0,11.264,9.216,20.48,20.48,20.48h41.472c2.56,0,4.608,2.048,5.12,4.608l31.744,216.064
                   c4.096,27.136,27.648,47.616,55.296,47.616h212.992c26.624,0,49.664-18.944,55.296-45.056l33.28-166.4
                   C457.728,97.71,450.56,86.958,439.296,84.91z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M215.04,389.55c-1.024-28.16-24.576-50.688-52.736-50.688c-29.696,1.536-52.224,26.112-51.2,55.296
                   c1.024,28.16,24.064,50.688,52.224,50.688h1.024C193.536,443.31,216.576,418.734,215.04,389.55z"
                      />
                    </g>
                  </g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                </svg>
              </a>
              <button class="btn nav_search-btn" type="button">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
              <div class="user-block">
                <span v-if="authStore.token" class="user_name">
                  <i class="fa fa-user"></i>
                  {{ authStore.user?.nombre || authStore.user?.usuario || 'Usuario' }}
                  <button class="order_online" @click="logout">Cerrar Sesión</button>
                </span>
                <RouterLink v-else to="/login" class="order_online user-login-btn">
                  <i class="fa fa-user"></i> Iniciar Sesión
                </RouterLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <!-- end header section -->
  </div>
</template>

<style scoped>
.user_name {
  color: #fff;
  margin-right: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.order_online {
  background: #ffbe33;
  color: #222831;
  border: none;
  border-radius: 18px;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.order_online:hover {
  background: #ffa500;
}
.gestion-dropdown {
  position: relative;
}
.gestion-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #fff !important;
  font-weight: 700;
  border-radius: 18px;
  padding: 0.5rem 1.2rem;
  transition: background 0.2s;
}
.gestion-toggle.active,
.gestion-toggle:hover {
  background: #ffbe33;
  color: #222831 !important;
}
.gestion-menu {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 180px;
  background: #222831;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.13);
  z-index: 100;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  animation: fadeInDown 0.18s;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.gestion-item {
  color: #fff;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition:
    background 0.18s,
    color 0.18s;
}
.gestion-item:hover {
  background: #ffbe33;
  color: #222831;
}

.user_option {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-login-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* MainHeader.vue */
.header_section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s;
  will-change: transform;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  background: #171717; /* O el fondo que uses */
}
.header-hidden {
  transform: translateY(-100%);
  box-shadow: none;
}
</style>
