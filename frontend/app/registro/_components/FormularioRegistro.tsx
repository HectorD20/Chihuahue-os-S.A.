'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TextField,
  toast,
} from '@heroui/react';
import { registrarUsuario } from '@/actions/auth/register';

interface FormularioRegistroProps {
  redirectTo?: string;
}

export default function FormularioRegistro({
  redirectTo,
}: FormularioRegistroProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const resultado = await registrarUsuario(formData);

      if (resultado && !resultado.success) {
        toast.danger('No se pudo crear la cuenta', {
          description: resultado.error,
        });
      }
    });
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate como pasajero para reservar asientos y confirmar tus
            boletos en Chihuahueños S.A.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="registro-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <TextField fullWidth isRequired name="nombre" type="text">
              <Label>Nombre completo</Label>
              <Input
                autoComplete="name"
                placeholder="Ej. María González"
                disabled={isPending}
              />
            </TextField>

            <TextField fullWidth isRequired name="email" type="email">
              <Label>Correo electrónico</Label>
              <Input
                autoComplete="email"
                placeholder="tu@correo.com"
                disabled={isPending}
              />
            </TextField>

            <TextField fullWidth isRequired name="password" type="password">
              <Label>Contraseña</Label>
              <Input
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                disabled={isPending}
              />
            </TextField>

            {redirectTo ? (
              <input type="hidden" name="redirect" value={redirectTo} />
            ) : null}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            form="registro-form"
            variant="primary"
            fullWidth
            isDisabled={isPending}
          >
            {isPending ? 'Creando cuenta...' : 'Registrarme'}
          </Button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link
              href={
                redirectTo
                  ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                  : '/login'
              }
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
