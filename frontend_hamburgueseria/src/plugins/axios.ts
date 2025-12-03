import Axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/index'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const clienteToken =
    typeof window !== 'undefined' ? localStorage.getItem('cliente_token') : ''
  const bearer = authStore.token || clienteToken

  if (config.headers) {
    config.headers['Content-type'] = 'application/json'
    if (bearer) {
      config.headers['Authorization'] = 'Bearer ' + bearer
    } else {
      delete config.headers['Authorization']
    }
  }
  return config
})

export default axios
