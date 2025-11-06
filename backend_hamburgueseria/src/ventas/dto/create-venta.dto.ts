import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo fecha debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha debe ser tipo fecha' })
  readonly fecha: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  readonly total: number;

  @ApiProperty()
  @IsInt()
  readonly idUsuario: number;

  @ApiProperty()
  @IsInt()
  readonly idCliente: number;
}

class DetalleVentaDto {
  @ApiProperty()
  @IsInt()
  readonly idProducto: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly cantidad: number;

  @ApiProperty()
  @IsNumber()
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNumber()
  readonly subtotal: number;
}

export class CreateVentaConDetallesDto extends CreateVentaDto {
  @ApiProperty({ type: [DetalleVentaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalleVenta: DetalleVentaDto[];
}
