import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApiKeyOrJwtRolesGuard } from '@/common/guards/api-key-or-jwt-roles.guard';
import { RolUsuario } from '@/database/entities/usuario.entity';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';
import { RutasService } from '@/rutas/rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyOrJwtRolesGuard)
  @Roles(RolUsuario.ADMIN)
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }
}
