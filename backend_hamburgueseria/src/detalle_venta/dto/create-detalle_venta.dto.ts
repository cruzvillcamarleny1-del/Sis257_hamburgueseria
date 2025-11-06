import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsInt({ message: 'El id de la venta debe ser un número entero' })
  readonly idVenta: number;

  @ApiProperty()
  @IsInt({ message: 'El id del producto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty()
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  readonly cantidad: number;

  @ApiProperty()
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser positivo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @IsPositive({ message: 'El subtotal debe ser positivo' })
  readonly subtotal: number;
}
