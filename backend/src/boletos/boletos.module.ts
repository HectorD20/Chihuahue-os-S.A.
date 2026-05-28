import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletoEntity, UsuarioEntity } from '@/database/entities';
import { BoletosController } from '@/boletos/boletos.controller';
import { BoletosService } from '@/boletos/boletos.service';
import { StorageModule } from '@/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoletoEntity, UsuarioEntity]),
    StorageModule,
  ],
  controllers: [BoletosController],
  providers: [BoletosService],
})
export class BoletosModule {}
