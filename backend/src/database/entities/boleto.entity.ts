import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '@/database/entities/usuario.entity';
import { ViajeEntity } from '@/database/entities/viaje.entity';

export enum EstadoBoleto {
  DISPONIBLE = 'DISPONIBLE',
  RESERVADO = 'RESERVADO',
  COMPRADO = 'COMPRADO',
}

@Entity('boletos')
export class BoletoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'viaje_id', type: 'int' })
  viaje_id: number;

  @ManyToOne(() => ViajeEntity, (viaje) => viaje.boletos, { nullable: false })
  @JoinColumn({ name: 'viaje_id' })
  viaje: ViajeEntity;

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuario_id: string | null;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.boletos, {
    nullable: true,
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity | null;

  @Column({ name: 'numero_asiento', type: 'int' })
  numero_asiento: number;

  @Column({
    type: 'enum',
    enum: EstadoBoleto,
    default: EstadoBoleto.DISPONIBLE,
  })
  estado: EstadoBoleto;

  @Column({ name: 'token_reserva', type: 'uuid', nullable: true })
  token_reserva: string | null;

  @Column({ name: 'bloqueado_hasta', type: 'timestamp', nullable: true })
  bloqueado_hasta: Date | null;
}
