import {
  BadRequestException,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '@/common/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { BoletosService } from '@/boletos/boletos.service';
import { ConfirmarBoletoDto } from '@/boletos/dto/confirmar-boleto.dto';

const MAX_IDENTIFICACION_SIZE = 5 * 1024 * 1024;
const IDENTIFICACION_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
];

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post('confirmar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('identificacion', {
      limits: { fileSize: MAX_IDENTIFICACION_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!IDENTIFICACION_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Tipo de archivo no permitido. Use PDF, PNG o JPG.',
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  confirmar(
    @Body() dto: ConfirmarBoletoDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUserId() usuarioId: string,
  ) {
    return this.boletosService.confirmarCompra(dto, file, usuarioId);
  }

  @Post(':id/reservar')
  @UseGuards(JwtAuthGuard)
  reservar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() usuarioId: string,
  ) {
    return this.boletosService.reservar(id, usuarioId);
  }
}
