import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRutaDto {
  @IsString()
  @IsNotEmpty()
  origen: string;

  @IsString()
  @IsNotEmpty()
  destino: string;
}
