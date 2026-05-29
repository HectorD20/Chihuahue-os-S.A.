import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  BoletoEntity,
  EstadoBoleto,
  RutaEntity,
  ViajeEntity,
} from '@/database/entities';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';

const BOLETOS_POR_VIAJE = 40;

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(RutaEntity)
    private readonly rutaRepository: Repository<RutaEntity>,
    @InjectRepository(ViajeEntity)
    private readonly viajeRepository: Repository<ViajeEntity>,
    @InjectRepository(BoletoEntity)
    private readonly boletoRepository: Repository<BoletoEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<ViajeEntity[]> {
    return this.viajeRepository.find({
      relations: { ruta: true },
      order: { fecha_hora_inicio: 'ASC' },
    });
  }

  async create(dto: CreateViajeDto): Promise<ViajeEntity> {
    const ruta = await this.rutaRepository.findOne({
      where: { id: dto.ruta_id },
    });

    if (!ruta) {
      throw new NotFoundException(`Ruta con id ${dto.ruta_id} no encontrada`);
    }

    return this.dataSource.transaction(async (manager) => {
      const viaje = manager.create(ViajeEntity, {
        ruta_id: dto.ruta_id,
        fecha_hora_inicio: new Date(dto.fecha_hora_inicio),
        duracion: dto.duracion,
        precio_boleto: dto.precio_boleto.toFixed(2),
        capacidad: dto.capacidad,
      });

      const savedViaje = await manager.save(viaje);

      const boletos = Array.from({ length: BOLETOS_POR_VIAJE }, (_, index) => ({
        viaje_id: savedViaje.id,
        numero_asiento: index + 1,
        estado: EstadoBoleto.DISPONIBLE,
      }));

      await manager.insert(BoletoEntity, boletos);

      return savedViaje;
    });
  }

  async findBoletosByViajeId(viajeId: number): Promise<BoletoEntity[]> {
    const viaje = await this.viajeRepository.findOne({
      where: { id: viajeId },
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${viajeId} no encontrado`);
    }

    const boletos = await this.boletoRepository.find({
      where: { viaje_id: viajeId },
      order: { numero_asiento: 'ASC' },
    });

    const ahora = new Date();
    const expirados: BoletoEntity[] = [];

    for (const boleto of boletos) {
      if (
        boleto.estado === EstadoBoleto.RESERVADO &&
        boleto.bloqueado_hasta &&
        boleto.bloqueado_hasta <= ahora
      ) {
        boleto.estado = EstadoBoleto.DISPONIBLE;
        boleto.token_reserva = null;
        boleto.bloqueado_hasta = null;
        boleto.usuario_id = null;
        expirados.push(boleto);
      }
    }

    if (expirados.length > 0) {
      await Promise.all(
        expirados.map((boleto) => this.boletoRepository.save(boleto)),
      );
    }

    return boletos;
  }
}
