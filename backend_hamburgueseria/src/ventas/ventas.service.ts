import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { CreateVentaConDetallesDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createVentaDto: CreateVentaConDetallesDto): Promise<Venta> {
    const { idUsuario, idCliente, fecha, total, detalleVenta } = createVentaDto;

    const venta = this.ventaRepository.create({
      fecha,
      total,
      usuario: { id: idUsuario },
      cliente: { id: idCliente },
    });

    const ventaGuardada = await this.ventaRepository.save(venta);

    for (const detalle of detalleVenta) {
      const detalleVentaEntity = this.detalleVentaRepository.create({
        venta: ventaGuardada,
        producto: { id: detalle.idProducto },
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      });
      await this.detalleVentaRepository.save(detalleVentaEntity);
    }

    return ventaGuardada;
  }

  findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['usuario', 'cliente', 'detalleVenta', 'detalleVenta.producto'],
    });
  }
}
