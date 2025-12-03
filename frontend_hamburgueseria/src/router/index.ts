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
      path: '/login-cliente',
      name: 'login-cliente',
      component: () => import('../views/LoginClienteView.vue'),
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: () => import('../views/ProveedorView.vue'),
    },
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('../views/CarritoView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
    {
      path: '/register-cliente',
      name: 'register-cliente',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/pedidos-cliente',
      name: 'pedidos-cliente',
      component: () => import('../views/PedidosClienteView.vue'),
    },
        {
      path: '/pedidos-empleado',
      name: 'pedidos-empleado',
      component: () => import('../views/PedidosEmpleadosView.vue'),
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
const employeeOnly = ['/producto', '/proveedor', '/pedidos-empleado', '/cliente', '/ventas']
const clientOnly = ['/pedidos-cliente']

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/', '/login', '/about', '/carrito', '/login-cliente', '/register-cliente']
  const authRequired = !publicPages.includes(to.path)
  const clienteToken = typeof window !== 'undefined' ? localStorage.getItem('cliente_token') : ''
  const rol = typeof window !== 'undefined' ? localStorage.getItem('rol') || '' : ''

  if (employeeOnly.includes(to.path) && rol === 'cliente') {
    return next('/')
  }

  if (clientOnly.includes(to.path) && !clienteToken) {
    return next('/login-cliente')
  }

  if (authRequired && !authStore.token && !clienteToken) {
    return next('/login')
  }

  next()
})

export default router
