import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoletoEntity } from '@/database/entities/boleto.entity';

export enum RolUsuario {
  PASAJERO = 'PASAJERO',
  ADMIN = 'ADMIN',
}

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ name: 'identificacion_url', type: 'varchar', nullable: true })
  identificacion_url: string | null;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.PASAJERO })
  role: RolUsuario;

  @OneToMany(() => BoletoEntity, (boleto) => boleto.usuario)
  boletos: BoletoEntity[];
}
