import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BoletoEntity,
  EstadoBoleto,
  UsuarioEntity,
} from '@/database/entities';

export interface PerfilUsuario {
  id: string;
  nombre: string;
  email: string;
  role: string;
  identificacion_url: string | null;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
  ) {}

  async obtenerPerfil(usuarioId: string): Promise<PerfilUsuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      identificacion_url: usuario.identificacion_url,
    };
  }

  async obtenerHistorialCompras(usuarioId: string): Promise<BoletoEntity[]> {
    return this.boletoRepository.find({
      where: {
        usuario_id: usuarioId,
        estado: EstadoBoleto.COMPRADO,
      },
      relations: {
        viaje: {
          ruta: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
