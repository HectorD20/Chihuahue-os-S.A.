'use client';

import { useRouter } from 'next/navigation';
import { Button, Dropdown } from '@heroui/react';
import { cerrarSesion } from '@/actions/auth/logout';

interface MenuCuentaProps {
  autenticado: boolean;
}

export default function MenuCuenta({ autenticado }: MenuCuentaProps) {
  const router = useRouter();

  if (autenticado) {
    return (
      <Button
        size="sm"
        variant="secondary"
        onPress={() => router.push('/dashboard/cuenta')}
      >
        Mi cuenta
      </Button>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Trigger className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50">
        Mi cuenta
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="Opciones de cuenta"
          onAction={(key) => {
            if (key === 'login') {
              router.push('/login');
              return;
            }

            if (key === 'registro') {
              router.push('/registro');
            }
          }}
        >
          <Dropdown.Item id="login" textValue="Iniciar sesión">
            Iniciar sesión
          </Dropdown.Item>
          <Dropdown.Item id="registro" textValue="Crear cuenta">
            Crear cuenta
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
