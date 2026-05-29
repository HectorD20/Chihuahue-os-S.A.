import FormularioRegistro from './_components/FormularioRegistro';

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  return <FormularioRegistro redirectTo={redirectTo} />;
}
