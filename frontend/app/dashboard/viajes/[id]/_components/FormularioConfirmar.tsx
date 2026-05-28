'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, toast } from '@heroui/react';
import { confirmarCompraBoleto } from '@/actions/boletos/confirmar';

interface FormularioConfirmarProps {
  numeroAsiento: number;
  tokenReserva: string;
  onCompraExitosa?: () => void;
}

export default function FormularioConfirmar({
  numeroAsiento,
  tokenReserva,
  onCompraExitosa,
}: FormularioConfirmarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const archivo = inputRef.current?.files?.[0];
    if (!archivo) {
      toast.danger('Identificación requerida', {
        description: 'Sube un PDF o imagen (PNG/JPG) de tu identificación.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('token_reserva', tokenReserva);
    formData.append('numero_asiento', String(numeroAsiento));
    formData.append('identificacion', archivo);

    startTransition(async () => {
      const resultado = await confirmarCompraBoleto(formData);

      if (resultado.success) {
        toast.success('Compra confirmada', {
          description: `El asiento ${numeroAsiento} quedó registrado como comprado.`,
        });
        onCompraExitosa?.();
        router.refresh();
        return;
      }

      const expirada =
        resultado.error.toLowerCase().includes('expir') ||
        resultado.error.toLowerCase().includes('gone');

      toast.danger(
        expirada ? 'Reserva expirada' : 'No se pudo confirmar la compra',
        { description: resultado.error },
      );

      if (expirada) {
        onCompraExitosa?.();
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Confirmar compra
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Asiento {numeroAsiento}. Sube tu identificación (PDF, PNG o JPG, máx.
          5 MB).
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Identificación
        </span>
        <input
          ref={inputRef}
          type="file"
          name="identificacion"
          accept="application/pdf,image/png,image/jpeg"
          disabled={isPending}
          onChange={(event) => {
            const archivo = event.target.files?.[0];
            setNombreArchivo(archivo?.name ?? null);
          }}
          className="block w-full cursor-pointer rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {nombreArchivo ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Archivo: {nombreArchivo}
          </span>
        ) : null}
      </label>

      <Button
        type="submit"
        fullWidth
        variant="primary"
        isDisabled={isPending}
      >
        {isPending ? 'Confirmando compra...' : 'Confirmar compra'}
      </Button>
    </form>
  );
}
