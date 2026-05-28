import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class ConfirmarBoletoDto {
  @IsUUID()
  token_reserva: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  numero_asiento: number;
}
