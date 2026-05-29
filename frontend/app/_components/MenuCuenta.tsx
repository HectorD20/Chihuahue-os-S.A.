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
      <Dropdown.Trigger>
        <Button size="sm" variant="secondary">
          Mi cuenta
        </Button>
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
