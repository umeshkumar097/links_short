import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string; slug: string }> }
) {
  const { subdomain, slug } = await params;

  // 1. Tenant ko subdomain se dhundhein
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Link ko slug AND tenantId se dhundhein
  const link = await prisma.link.findUnique({
    where: {
      slug_tenantId: {
        slug,
        tenantId: tenant.id,
      },
    },
  });

  // 3. Agar link nahi mila
  if (!link) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Click count badhayein
  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  // 5. Redirect
  return NextResponse.redirect(link.targetUrl, { status: 301 });
}
