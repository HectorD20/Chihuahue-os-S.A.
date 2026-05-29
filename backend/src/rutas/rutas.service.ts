import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaEntity } from '@/database/entities';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(RutaEntity)
    private readonly rutaRepository: Repository<RutaEntity>,
  ) {}

  async create(dto: CreateRutaDto): Promise<RutaEntity> {
    const ruta = this.rutaRepository.create(dto);
    return this.rutaRepository.save(ruta);
  }

  async findAll(): Promise<RutaEntity[]> {
    return this.rutaRepository.find({
      order: { id: 'ASC' },
    });
  }
}
