import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClienteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El campo ci debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo ci no debe ser mayor a 20 caracteres' })
  readonly ci?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(70, { message: 'El campo nombre no debe ser mayor a 70 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo apellido no debe ser vacío' })
  @IsString({ message: 'El campo apellido debe ser de tipo cadena' })
  @MaxLength(70, { message: 'El campo apellido no debe ser mayor a 70 caracteres' })
  readonly apellido: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo telefono es obligatorio' })
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(10, {
    message: 'El campo telefono no debe ser mayor a 10 caracteres',
  })
  readonly telefono?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo direccion es obligatorio' })
  @IsString({ message: 'El campo direccion debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo direccion no debe ser mayor a 100 caracteres',
  })
  readonly direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly password?: string;
}
