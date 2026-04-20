import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;
  
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  
  // 1. Master Admin Login
  if (subdomain === 'app') {
    const adminPass = process.env.ADMIN_PASSWORD;
    if (password === adminPass) {
      (await cookies()).set('auth-token', 'admin-session', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/' 
      });
      return NextResponse.json({ success: true, role: 'admin' });
    }
  }

  // 2. Client Login
  if (subdomain && subdomain !== 'app' && subdomain !== 'localhost' && subdomain !== 'localhost:3000') {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });
    
    if (tenant && tenant.password === password) {
      (await cookies()).set('auth-token', `tenant-${tenant.id}`, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/' 
      });
      return NextResponse.json({ success: true, role: 'tenant' });
    }
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
