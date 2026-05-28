import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaEntity } from '@/database/entities';
import { RutasController } from '@/rutas/rutas.controller';
import { RutasService } from '@/rutas/rutas.service';

@Module({
  imports: [TypeOrmModule.forFeature([RutaEntity])],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
