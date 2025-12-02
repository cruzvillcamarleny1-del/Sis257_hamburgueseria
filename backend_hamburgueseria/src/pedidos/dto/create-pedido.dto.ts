export class CreatePedidoDto {
  idCliente: number;
  fecha: Date;
  total: number;
  estado: string;
  metodoPago: string;
  direccionEnvio?: string;
  detalles: {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}