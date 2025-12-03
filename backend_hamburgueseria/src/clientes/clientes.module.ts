import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hamburgueseria_super_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
