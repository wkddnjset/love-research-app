import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from '@/lib/admin-auth';

// GET - check if admin is authenticated
export async function GET() {
  const authed = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

// POST - login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: 'Credentials required' }, { status: 400 });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}

// DELETE - logout
export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
