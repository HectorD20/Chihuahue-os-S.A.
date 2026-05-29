import FormularioLogin from './_components/FormularioLogin';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  return <FormularioLogin redirectTo={redirectTo} />;
}
