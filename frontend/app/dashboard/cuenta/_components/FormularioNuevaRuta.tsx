'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TextField,
  toast,
} from '@heroui/react';
import { crearRutaConViaje } from '@/actions/rutas/crear';

export default function FormularioNuevaRuta() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const resultado = await crearRutaConViaje(formData);

      if (resultado.success) {
        toast.success('Ruta publicada en cartelera', {
          description: `${resultado.data.ruta.origen} → ${resultado.data.ruta.destino} · Viaje #${resultado.data.viaje.id}`,
        });
        form.reset();
        router.refresh();
        return;
      }

      toast.danger('No se pudo publicar la ruta', {
        description: resultado.error,
      });
    });
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle>Administración de rutas</CardTitle>
        <CardDescription>
          Crea una ruta y programa su primer viaje. Aparecerá de inmediato en la
          cartelera y en la página de inicio.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <TextField fullWidth isRequired name="origen" type="text">
            <Label>Ciudad de origen</Label>
            <Input placeholder="Ej. Oaxaca" disabled={isPending} />
          </TextField>

          <TextField fullWidth isRequired name="destino" type="text">
            <Label>Ciudad de destino</Label>
            <Input placeholder="Ej. Puebla" disabled={isPending} />
          </TextField>

          <TextField
            fullWidth
            isRequired
            name="fecha_hora_inicio"
            type="datetime-local"
            className="sm:col-span-2"
          >
            <Label>Fecha y hora de salida</Label>
            <Input disabled={isPending} />
          </TextField>

          <TextField
            fullWidth
            isRequired
            name="duracion"
            type="number"
            defaultValue="480"
          >
            <Label>Duración (minutos)</Label>
            <Input
              placeholder="Ej. 480"
              min={1}
              step={1}
              disabled={isPending}
            />
          </TextField>

          <TextField fullWidth isRequired name="precio_boleto" type="number">
            <Label>Precio del boleto (MXN)</Label>
            <Input
              placeholder="Ej. 850"
              min={0.01}
              step={0.01}
              disabled={isPending}
            />
          </TextField>

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" isDisabled={isPending}>
              {isPending ? 'Publicando ruta...' : 'Agregar ruta y viaje'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
