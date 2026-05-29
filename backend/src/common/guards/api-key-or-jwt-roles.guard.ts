import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Injectable()
export class ApiKeyOrJwtRolesGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.hasValidApiKey(context)) {
      return true;
    }

    this.jwtAuthGuard.canActivate(context);
    return this.rolesGuard.canActivate(context);
  }

  private hasValidApiKey(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const expectedKey = process.env.API_KEY;

    return !!expectedKey && apiKey === expectedKey;
  }
}
