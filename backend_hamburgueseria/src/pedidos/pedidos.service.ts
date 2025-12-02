import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
  const pedido = this.pedidoRepository.create(createPedidoDto);
  return await this.pedidoRepository.save(pedido);
}

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({ where: { id } });
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    await this.pedidoRepository.update(id, updatePedidoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.pedidoRepository.delete(id);
  }

  async findByCliente(idCliente: number): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { idCliente },
      relations: ['detalles'],
      order: { fecha: 'DESC' },
    });
  }

  async findByEstado(estado: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { estado },
      relations: ['detalles', 'cliente'],
      order: { fecha: 'DESC' },
    });
  }

  async updateEstado(id: number, estado: string): Promise<Pedido> {
    await this.pedidoRepository.update(id, { estado });
    return this.findOne(id);
  }
}
