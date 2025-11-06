import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { VentasModule } from './ventas/ventas.module';
import { DetalleVentaModule } from './detalle_venta/detalle_venta.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '*/**/entities/*.{ts|js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductosModule,
    ClientesModule,
    UsuariosModule,
    ProveedoresModule,
    VentasModule,
    DetalleVentaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
