import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo fotografia es obligatorio' })
  @IsString({ message: 'El campo fotografia debe ser de tipo cadena' })
  @MaxLength(500, {
    message: 'El campo fotografia no debe ser mayor a 500 caracteres',
  })
  readonly imagen: string;

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
  @IsNotEmpty({ message: 'El precio no puede estar vacío.' })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsPositive({ message: 'El precio debe ser un número positivo.' })
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El stock no puede estar vacío.' })
  @IsNumber({}, { message: 'El stock debe ser un número.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  readonly stock: number;
}
