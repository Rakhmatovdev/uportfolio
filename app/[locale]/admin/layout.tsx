import React from 'react';
import { getSession } from '@/lib/auth';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const session = await getSession();

  // If there is no session (e.g. on the login page), render children directly to prevent infinite redirect loops
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutClient session={session}>
      {children}
    </AdminLayoutClient>
  );
}
