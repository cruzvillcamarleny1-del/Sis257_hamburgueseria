import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(70, { message: 'El campo nombre no debe ser mayor a 70 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion no debe ser vacío' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo descripcion no debe ser mayor a 255 caracteres' })
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo tipo no debe ser vacío' })
  @IsString({ message: 'El campo tipo debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo tipo no debe ser mayor a 100 caracteres' })
  readonly tipo: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo precio_venta debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio_venta debe tener máximo 2 decimales' })
  readonly precioVenta: number;
}
