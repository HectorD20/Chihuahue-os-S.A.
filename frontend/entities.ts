export type RolUsuario = 'CLIENTE' | 'ADMIN';

export type EstadoBoleto = 'DISPONIBLE' | 'RESERVADO' | 'COMPRADO';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  identificacion_url?: string;
  rol: RolUsuario;
}

export interface Ruta {
  id: number;
  origen: string;
  destino: string;
}

export interface Viaje {
  id: number;
  ruta_id: number;
  fecha_hora_inicio: string;
  duracion: number;
  precio_boleto: number;
  capacidad: number;
}

export interface Boleto {
  id: number;
  viaje_id: number;
  usuario_id?: string;
  numero_asiento: number;
  estado: EstadoBoleto;
  token_reserva?: string;
  bloqueado_hasta?: string;
}
