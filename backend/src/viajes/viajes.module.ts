import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletoEntity, RutaEntity, ViajeEntity } from '@/database/entities';
import { ViajesController } from '@/viajes/viajes.controller';
import { ViajesService } from '@/viajes/viajes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViajeEntity, RutaEntity, BoletoEntity]),
  ],
  controllers: [ViajesController],
  providers: [ViajesService],
})
export class ViajesModule {}
