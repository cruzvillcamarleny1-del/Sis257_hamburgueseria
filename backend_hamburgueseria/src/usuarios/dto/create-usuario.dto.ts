import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  @IsString({ message: 'El campo usuario debe ser de tipo cadena' })
  @MaxLength(15, {
    message: 'El campo usuario no debe ser mayor a 15 caracteres',
  })
  readonly usuario: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo clave es obligatorio' })
  @IsString({ message: 'El campo clave debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo clave no debe ser mayor a 100 caracteres',
  })
  readonly clave: string;
}
