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
import { loginUsuario } from '@/actions/auth/login';

interface FormularioLoginProps {
  redirectTo?: string;
}

export default function FormularioLogin({ redirectTo }: FormularioLoginProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const resultado = await loginUsuario(formData);

      if (resultado && !resultado.success) {
        toast.danger('No se pudo iniciar sesión', {
          description: resultado.error,
        });
      }
    });
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-start gap-2">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Accede a la cartelera de Chihuahueños S.A. con tu cuenta de
            pasajero o administrador.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="login-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
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
                autoComplete="current-password"
                placeholder="••••••••"
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
            form="login-form"
            variant="primary"
            fullWidth
            isDisabled={isPending}
          >
            {isPending ? 'Verificando credenciales...' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            ¿No tienes cuenta?{' '}
            <Link
              href={
                redirectTo
                  ? `/registro?redirect=${encodeURIComponent(redirectTo)}`
                  : '/registro'
              }
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
