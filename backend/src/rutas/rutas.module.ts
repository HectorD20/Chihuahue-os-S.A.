import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { RutaEntity } from '@/database/entities';
import { RutasController } from '@/rutas/rutas.controller';
import { RutasService } from '@/rutas/rutas.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([RutaEntity])],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
