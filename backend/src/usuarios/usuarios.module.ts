import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { BoletoEntity, UsuarioEntity } from '@/database/entities';
import { UsuariosController } from '@/usuarios/usuarios.controller';
import { UsuariosService } from '@/usuarios/usuarios.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UsuarioEntity, BoletoEntity]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
