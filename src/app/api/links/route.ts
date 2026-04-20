import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to get tenant from host
async function getTenant(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  
  if (!subdomain || subdomain === 'app' || subdomain === 'localhost:3000' || subdomain === 'localhost') {
    return null;
  }
  
  return await prisma.tenant.findUnique({
    where: { subdomain }
  });
}

// GET: Saare links dekhne ke liye (Filtered by Tenant)
export async function GET(request: NextRequest) {
  const tenant = await getTenant(request);
  
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found or access from main domain' }, { status: 404 });
  }

  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(links);
}

// POST: Naya link create karne ke liye
export async function POST(request: NextRequest) {
  const tenant = await getTenant(request);
  
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const body = await request.json();
  const { slug, targetUrl } = body;

  try {
    const newLink = await prisma.link.create({
      data: { 
        slug, 
        targetUrl, 
        tenantId: tenant.id 
      },
    });
    return NextResponse.json(newLink);
  } catch (error) {
    return NextResponse.json({ error: 'Slug already exists for this client or invalid data' }, { status: 400 });
  }
}
