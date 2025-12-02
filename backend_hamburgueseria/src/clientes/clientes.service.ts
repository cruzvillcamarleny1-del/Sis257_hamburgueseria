import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private clientesRepository: Repository<Cliente>) { }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existe = await this.clientesRepository.findOneBy({
      ci: createClienteDto.ci?.trim(),
      nombre: createClienteDto.nombre.trim(),
      apellido: createClienteDto.apellido.trim(),
      telefono: createClienteDto.telefono?.trim(),
      direccion: createClienteDto.direccion?.trim(),
      email: createClienteDto.email?.trim(),
      password: createClienteDto.password?.trim(),
    });

    if (existe) throw new ConflictException('El cliente ya existe');

    const cliente = new Cliente();
    cliente.ci = createClienteDto.ci?.trim();
    cliente.nombre = createClienteDto.nombre.trim();
    cliente.apellido = createClienteDto.apellido.trim();
    cliente.telefono = createClienteDto.telefono?.trim();
    cliente.direccion = createClienteDto.direccion?.trim();
    cliente.email = createClienteDto.email?.trim();
    cliente.password = createClienteDto.password?.trim();
    return this.clientesRepository.save(cliente);
  }

  async findAll() {
    return this.clientesRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('El cliente no existe');
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    const clienteUpdate = Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(clienteUpdate);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    if (cliente) return this.clientesRepository.softRemove(cliente);
  }

  async registerWeb(createClienteDto: CreateClienteDto): Promise<Cliente> {
    if (!createClienteDto.email || !createClienteDto.password) {
      throw new ConflictException('Email y contraseña son requeridos');
    }
    const existe = await this.clientesRepository.findOne({
      where: { email: createClienteDto.email.trim() },
    });
    if (existe) throw new ConflictException('El email ya está registrado');

    const cliente = new Cliente();
    cliente.ci = createClienteDto.ci?.trim();
    cliente.nombre = createClienteDto.nombre.trim();
    cliente.apellido = createClienteDto.apellido?.trim();
    cliente.telefono = createClienteDto.telefono?.trim();
    cliente.direccion = createClienteDto.direccion?.trim();
    cliente.email = createClienteDto.email.trim();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      cliente.password = (await bcrypt.hash(createClienteDto.password, 10)) as string;
    } catch {
      throw new ConflictException('Error al encriptar la contraseña');
    }

    return this.clientesRepository.save(cliente);
  }

  async loginWeb(email: string, password: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: { email } });
    if (!cliente || !cliente.password) throw new UnauthorizedException('Credenciales incorrectas');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const match = await bcrypt.compare(password, cliente.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');
    return cliente;
  }
}
