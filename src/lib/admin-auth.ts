import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_session';
const SALT = 'love-research-admin-v2';

function generateToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? '';
  return createHash('sha256').update(password + SALT).digest('hex');
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return (
    username === (process.env.ADMIN_USERNAME ?? '') &&
    password === (process.env.ADMIN_PASSWORD ?? '')
  );
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, generateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === generateToken();
}
