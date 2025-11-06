import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const detalleVenta = this.detalleVentaRepository.create({
      idVenta: createDetalleVentaDto.idVenta,
      idProducto: createDetalleVentaDto.idProducto,
      cantidad: createDetalleVentaDto.cantidad,
      precioUnitario: createDetalleVentaDto.precioUnitario,
      subtotal: createDetalleVentaDto.subtotal,
    });

    return await this.detalleVentaRepository.save(detalleVenta);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentaRepository.find({
      relations: ['venta', 'producto'],
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalle = await this.detalleVentaRepository.findOne({
      where: { id },
      relations: ['venta', 'producto'],
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de venta con id ${id} no encontrado`);
    }

    return detalle;
  }

  async update(id: number, updateDto: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const detalle = await this.findOne(id);
    Object.assign(detalle, updateDto);
    return this.detalleVentaRepository.save(detalle);
  }

  async remove(id: number): Promise<void> {
    const detalle = await this.findOne(id);
    await this.detalleVentaRepository.remove(detalle);
  }
}
