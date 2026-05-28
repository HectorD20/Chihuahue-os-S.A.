import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoletoEntity } from '@/database/entities/boleto.entity';
import { RutaEntity } from '@/database/entities/ruta.entity';

@Entity('viajes')
export class ViajeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ruta_id', type: 'int' })
  ruta_id: number;

  @ManyToOne(() => RutaEntity, (ruta) => ruta.viajes, { nullable: false })
  @JoinColumn({ name: 'ruta_id' })
  ruta: RutaEntity;

  @Column({ name: 'fecha_hora_inicio', type: 'timestamp' })
  fecha_hora_inicio: Date;

  @Column({ type: 'int' })
  duracion: number;

  @Column({ name: 'precio_boleto', type: 'decimal', precision: 10, scale: 2 })
  precio_boleto: string;

  @Column({ type: 'int' })
  capacidad: number;

  @OneToMany(() => BoletoEntity, (boleto) => boleto.viaje)
  boletos: BoletoEntity[];
}
