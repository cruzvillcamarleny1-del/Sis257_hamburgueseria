import type { DetalleVenta } from './detalleVenta'

export interface Venta {
  id?: number
  fecha?: string
  total: number
  id_usuario: number
  id_cliente: number
  detalles: DetalleVenta[]
}
