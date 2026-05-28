import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ViajeEntity } from '@/database/entities/viaje.entity';

@Entity('rutas')
export class RutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  origen: string;

  @Column({ type: 'varchar' })
  destino: string;

  @OneToMany(() => ViajeEntity, (viaje) => viaje.ruta)
  viajes: ViajeEntity[];
}
