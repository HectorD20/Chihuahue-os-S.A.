import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '@/common/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UsuariosService } from '@/usuarios/usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  obtenerPerfil(@CurrentUserId() usuarioId: string) {
    return this.usuariosService.obtenerPerfil(usuarioId);
  }

  @Get('me/compras')
  @UseGuards(JwtAuthGuard)
  obtenerHistorialCompras(@CurrentUserId() usuarioId: string) {
    return this.usuariosService.obtenerHistorialCompras(usuarioId);
  }
}
