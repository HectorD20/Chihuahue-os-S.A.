import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '@/common/guards/api-key.guard';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';
import { ViajesService } from '@/viajes/viajes.service';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Get(':id/boletos')
  findBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.findBoletosByViajeId(id);
  }
}
