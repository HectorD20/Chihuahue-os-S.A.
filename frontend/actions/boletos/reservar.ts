'use server';

import { revalidateTag } from 'next/cache';
import { API_URL } from '@/constants';
import type { Boleto } from '@/entities';
import { authHeaders } from '@/helpers/authHeaders';

type ReservarBoletoResult =
  | { success: true; data: Boleto }
  | { success: false; error: string };

export async function reservarBoleto(
  boletoId: number,
): Promise<ReservarBoletoResult> {
  const response = await fetch(
    `${API_URL}/boletos/${boletoId}/reservar`,
    {
      method: 'POST',
      headers: await authHeaders(),
    },
  );

  if (response.ok) {
    const data = (await response.json()) as Boleto;
    revalidateTag('viajes:boletos', 'max');
    return { success: true, data };
  }

  if (response.status === 409) {
    return {
      success: false,
      error:
        'Este asiento ya fue seleccionado por otro usuario o su reserva sigue activa.',
    };
  }

  return {
    success: false,
    error: 'No se pudo reservar el asiento. Intenta de nuevo más tarde.',
  };
}
