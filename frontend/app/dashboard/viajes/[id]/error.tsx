'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';

export default function ViajeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        No se pudo cargar el mapa de asientos
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || 'Ocurrió un error al consultar los boletos del viaje.'}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" onPress={reset}>
          Reintentar
        </Button>
        <Link href="/dashboard">
          <Button variant="secondary">Volver a la cartelera</Button>
        </Link>
      </div>
    </div>
  );
}
