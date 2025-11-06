import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 500, name: 'imagen' })
  imagen: string;

  @Column('varchar', { length: 70, name: 'nombre' })
  nombre: string;

  @Column('varchar', { length: 255, name: 'descripcion' })
  descripcion: string;

  @Column({ name: 'precio', type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column('int', { name: 'stock' })
  stock: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => DetalleVenta, detalleVentas => detalleVentas.producto)
  itemsVentas: DetalleVenta[];
}
