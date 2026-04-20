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

export async function POST(request: NextRequest) {
  const tenant = await getTenant(request);
  
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id }
  });
  let updatedCount = 0;

  for (const link of links) {
    try {
      // 1. Pehle HEAD request try karein (fast)
      let response = await fetch(link.targetUrl, { 
        method: 'HEAD',
        redirect: 'follow',
      });
      
      // 2. Agar HEAD fail ho (some sites block it), toh GET try karein
      if (!response.ok && response.status !== 404) {
        response = await fetch(link.targetUrl, { 
          method: 'GET',
          redirect: 'follow',
        });
      }
      
      // Database mein HTTP status update karein
      await prisma.link.update({
        where: { id: link.id },
        data: { httpStatus: response.status }
      });
      updatedCount++;
    } catch (error) {
      console.error(`Error verifying ${link.targetUrl}:`, error);
      await prisma.link.update({
        where: { id: link.id },
        data: { httpStatus: 500 }
      });
    }
  }

  return NextResponse.json({ message: `${updatedCount} links verified.` });
}
