import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 20, nullable: true })
  ci?: string;

  @Column('varchar', { length: 70 })
  nombre: string;

  @Column('varchar', { length: 70 })
  apellido: string;

  @Column('varchar', { length: 10, nullable: true })
  telefono?: string;

  @Column('varchar', { length: 100, nullable: true })
  direccion?: string;

  @Column('varchar', { length: 100, nullable: true, unique: true })
  email?: string;

  @Column('varchar', { length: 100, nullable: true })
  password?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, ventas => ventas.cliente)
  ventas: Venta[];
}
