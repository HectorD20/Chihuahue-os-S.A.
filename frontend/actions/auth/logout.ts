'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TOKEN_NAME } from '@/constants';

export async function cerrarSesion(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  redirect('/');
}
