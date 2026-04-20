import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Saare tenants dekhne ke liye (Master Admin use karega)
export async function GET() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { links: true }
      }
    }
  });
  return NextResponse.json(tenants);
}

// POST: Naya tenant create karne ke liye
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subdomain, password } = body;

    const newTenant = await prisma.tenant.create({
      data: { name, subdomain, password },
    });
    return NextResponse.json(newTenant);
  } catch (error) {
    return NextResponse.json({ error: 'Subdomain already exists or invalid data' }, { status: 400 });
  }
}
