import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

function parseStoredUser(raw: string | null) {
  if (!raw) return ''
  try {
    return raw.trim().startsWith('{') ? JSON.parse(raw) : raw
  } catch {
    return raw
  }
}

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: parseStoredUser(localStorage.getItem('user')),
    token: getTokenFromLocalStorage(),
    rol: localStorage.getItem('rol') || '',
    returnUrl: '',
  }),
  getters: {},
  actions: {
    async login(usuario: string, clave: string) {
      const { data } = await http.post('auth/login', { usuario, clave })
      this.user = data.usuario
      this.token = data.access_token
      this.rol = 'empleado'

      const serializedUser = typeof this.user === 'string' ? this.user : JSON.stringify(this.user)

      localStorage.setItem('user', serializedUser)
      localStorage.setItem('token', this.token || '')
      localStorage.setItem('rol', this.rol)

      router.push(this.returnUrl || '/')
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('rol')
      this.$reset()
      router.push('login')
    },
  },
})

export { useAuthStore }
