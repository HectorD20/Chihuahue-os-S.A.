import { Type } from 'class-transformer';
import {
  Equals,
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateViajeDto {
  @IsInt()
  @IsPositive()
  ruta_id: number;

  @IsDateString()
  fecha_hora_inicio: string;

  @IsInt()
  @IsPositive()
  duracion: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_boleto: number;

  @IsInt()
  @Equals(40)
  capacidad: number;
}
