const publicApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const API_URL = process.env.API_URL ?? publicApiUrl;

export const TOKEN_NAME = 'session_token';
