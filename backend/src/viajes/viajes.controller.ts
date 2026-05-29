import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApiKeyOrJwtRolesGuard } from '@/common/guards/api-key-or-jwt-roles.guard';
import { RolUsuario } from '@/database/entities/usuario.entity';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';
import { ViajesService } from '@/viajes/viajes.service';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get()
  findAll() {
    return this.viajesService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyOrJwtRolesGuard)
  @Roles(RolUsuario.ADMIN)
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Get(':id/boletos')
  findBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.findBoletosByViajeId(id);
  }
}
