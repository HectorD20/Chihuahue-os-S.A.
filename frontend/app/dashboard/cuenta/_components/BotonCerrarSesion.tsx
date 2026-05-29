'use client';

import { useTransition } from 'react';
import { Button } from '@heroui/react';
import { cerrarSesion } from '@/actions/auth/logout';

export default function BotonCerrarSesion() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      isDisabled={isPending}
      onPress={() => {
        startTransition(async () => {
          await cerrarSesion();
        });
      }}
    >
      {isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </Button>
  );
}
