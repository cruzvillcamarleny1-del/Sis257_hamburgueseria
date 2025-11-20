import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentaView.vue'),
    },
    {
      path: '/producto',
      name: 'producto',
      component: () => import('../views/ProductoView.vue'),
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: () => import('../views/ClienteView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: () => import('../views/ProveedorView.vue'),
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

// Guard para rutas privadas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/', '/login', '/about']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !authStore.token) {
    return next('/login')
  }
  next()
})

export default router
