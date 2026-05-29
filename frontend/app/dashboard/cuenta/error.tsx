'use client';

import { Button } from '@heroui/react';

export default function CuentaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        No se pudo cargar tu cuenta
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || 'Ocurrió un error al consultar tu información.'}
      </p>
      <Button variant="primary" onPress={reset}>
        Reintentar
      </Button>
    </div>
  );
}
