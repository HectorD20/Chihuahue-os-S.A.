import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';
import { RutasService } from '@/rutas/rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }
}
