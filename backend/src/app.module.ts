import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { BoletosModule } from '@/boletos/boletos.module';
import { RutasModule } from '@/rutas/rutas.module';
import { StorageModule } from '@/storage/storage.module';
import { UsuariosModule } from '@/usuarios/usuarios.module';
import { ViajesModule } from '@/viajes/viajes.module';
import {
  BoletoEntity,
  RutaEntity,
  UsuarioEntity,
  ViajeEntity,
} from '@/database/entities';

loadEnv({ path: resolve(process.cwd(), '../.env') });
loadEnv({ path: resolve(process.cwd(), '.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UsuarioEntity, RutaEntity, ViajeEntity, BoletoEntity],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    StorageModule,
    RutasModule,
    ViajesModule,
    BoletosModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
