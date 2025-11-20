import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { CreateVentaConDetallesDto } from './dto/create-venta.dto';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaConDetallesDto): Promise<Venta> {
    const { idUsuario, idCliente, fecha, total, detalleVenta } = createVentaDto;

    return this.dataSource.transaction(async manager => {
      const venta = manager.create(Venta, {
        fecha,
        total,
        usuario: { id: idUsuario },
        cliente: { id: idCliente },
      });

      const ventaGuardada = await manager.save(Venta, venta);

      for (const detalle of detalleVenta) {
        // Buscar el producto y validar stock
        const producto = await manager
          .getRepository(Producto)
          .findOne({ where: { id: detalle.idProducto }, lock: { mode: 'pessimistic_write' } });
        if (!producto)
          throw new NotFoundException(`Producto con id ${detalle.idProducto} no encontrado`);
        if (producto.stock == null)
          throw new BadRequestException(
            `El producto ${producto.nombre ?? producto.id} no tiene campo stock`,
          );
        if (producto.stock < detalle.cantidad)
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre ?? producto.id}`,
          );

        // Descontar stock
        producto.stock -= detalle.cantidad;
        await manager.save(Producto, producto);

        // Guardar el detalle de venta
        const detalleVentaEntity = manager.create(DetalleVenta, {
          venta: ventaGuardada,
          producto: { id: detalle.idProducto },
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal,
        });
        await manager.save(DetalleVenta, detalleVentaEntity);
      }

      const ventaFinal = await manager.getRepository(Venta).findOne({
        where: { id: ventaGuardada.id },
        relations: ['usuario', 'cliente', 'detalleVenta', 'detalleVenta.producto'],
      });

      if (!ventaFinal) {
        throw new NotFoundException(`Venta con id ${ventaGuardada.id} no encontrada`);
      }

      return ventaFinal;
    });
  }

  findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['usuario', 'cliente', 'detalleVenta', 'detalleVenta.producto'],
    });
  }
}
