import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetallePedidoDto {
  @IsNumber()
  @IsPositive()
  idProducto: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}

export class CreatePedidoDto {
  @IsNumber()
  @IsPositive()
  readonly idCliente: number;

  @IsDateString()
  readonly fecha: Date;

  @IsNumber()
  @IsPositive()
  readonly total: number;

  @IsString()
  @IsNotEmpty()
  readonly estado: string;

  @IsString()
  @IsNotEmpty()
  readonly metodoPago: string;

  @IsOptional()
  @IsString()
  readonly direccionEnvio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetallePedidoDto)
  readonly detalles: DetallePedidoDto[];
}
