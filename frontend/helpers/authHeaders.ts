import { cookies } from 'next/headers';
import { cache } from 'react';
import { TOKEN_NAME } from '@/constants';

export const authHeaders = cache(async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
});
