import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional } from 'class-validator';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export class CreateVentaDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo id_Cliente debe estar definido' })
  @IsInt({ message: 'El campo id_Cliente debe ser de tipo numérico' })
  readonly idCliente: Cliente['id'];
}
