import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { ConfirmarBoletoDto } from '@/boletos/dto/confirmar-boleto.dto';
import {
  BoletoEntity,
  EstadoBoleto,
  UsuarioEntity,
} from '@/database/entities';
import { StorageService } from '@/storage/storage.service';

const RESERVA_MINUTOS = 10;

@Injectable()
export class BoletosService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  async confirmarCompra(
    dto: ConfirmarBoletoDto,
    file: Express.Multer.File,
    usuarioId: string,
  ): Promise<BoletoEntity> {
    if (!file) {
      throw new BadRequestException('La identificación es obligatoria');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const boleto = await queryRunner.manager
        .createQueryBuilder(BoletoEntity, 'boleto')
        .setLock('pessimistic_write')
        .where('boleto.numero_asiento = :numero_asiento', {
          numero_asiento: dto.numero_asiento,
        })
        .andWhere('boleto.token_reserva = :token_reserva', {
          token_reserva: dto.token_reserva,
        })
        .getOne();

      if (!boleto) {
        throw new NotFoundException('Reserva inválida');
      }

      if (boleto.estado !== EstadoBoleto.RESERVADO) {
        throw new ConflictException('El boleto no se encuentra reservado');
      }

      const ahora = new Date();

      if (boleto.bloqueado_hasta && boleto.bloqueado_hasta <= ahora) {
        boleto.estado = EstadoBoleto.DISPONIBLE;
        boleto.token_reserva = null;
        boleto.bloqueado_hasta = null;
        boleto.usuario_id = null;

        await queryRunner.manager.save(boleto);
        await queryRunner.commitTransaction();
        throw new GoneException('La reserva ha expirado');
      }

      const identificacionUrl = await this.storageService.uploadFile(file);

      boleto.estado = EstadoBoleto.COMPRADO;
      boleto.token_reserva = null;
      boleto.bloqueado_hasta = null;

      await queryRunner.manager.update(UsuarioEntity, usuarioId, {
        identificacion_url: identificacionUrl,
      });

      const confirmado = await queryRunner.manager.save(boleto);
      await queryRunner.commitTransaction();

      return confirmado;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async reservar(id: number, usuarioId: string): Promise<BoletoEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const boleto = await queryRunner.manager
        .createQueryBuilder(BoletoEntity, 'boleto')
        .setLock('pessimistic_write')
        .where('boleto.id = :id', { id })
        .getOne();

      if (!boleto) {
        throw new NotFoundException(`Boleto con id ${id} no encontrado`);
      }

      const ahora = new Date();

      if (boleto.estado === EstadoBoleto.COMPRADO) {
        throw new ConflictException('El boleto ya fue comprado');
      }

      if (
        boleto.estado === EstadoBoleto.RESERVADO &&
        boleto.bloqueado_hasta &&
        boleto.bloqueado_hasta > ahora
      ) {
        throw new ConflictException('El boleto ya está reservado');
      }

      boleto.usuario_id = null;
      boleto.token_reserva = null;
      boleto.bloqueado_hasta = null;

      boleto.usuario_id = usuarioId;
      boleto.estado = EstadoBoleto.RESERVADO;
      boleto.token_reserva = randomUUID();
      boleto.bloqueado_hasta = new Date(
        ahora.getTime() + RESERVA_MINUTOS * 60 * 1000,
      );

      const reservado = await queryRunner.manager.save(boleto);
      await queryRunner.commitTransaction();

      return reservado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
