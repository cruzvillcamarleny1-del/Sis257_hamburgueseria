import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { DetallePedido } from './detalle_pedido.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCliente: number;

  @Column('timestamp')
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 20 })
  estado: string; // ejemplo: 'pendiente', 'pagado', 'enviado', 'entregado'

  @Column({ type: 'varchar', length: 20 })
  metodoPago: string; // ejemplo: 'qr', 'tarjeta', 'efectivo'

  @Column({ type: 'varchar', length: 100, nullable: true })
  direccionEnvio?: string;

  @OneToMany(() => DetallePedido, detalle => detalle.pedido, { cascade: true })
  detalles: DetallePedido[];

  @ManyToOne(() => Cliente, { eager: true })
  cliente: Cliente;
}
