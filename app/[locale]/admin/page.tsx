import React from 'react';
import prisma from '@/lib/prisma';
import DashboardClient from '@/components/admin/DashboardClient';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: AdminPageProps) {
  // Query all database metrics server-side
  const [usersCount, portfolioCount, newsCount, faqsCount, activityLogs] = await Promise.all([
    prisma.user.count(),
    prisma.portfolio.count(),
    prisma.news.count(),
    prisma.faq.count(),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      // The JSON database fallback returns logs populated, while Prisma can join.
      // We safely fetch logs, and map relationships.
    })
  ]);

  // Load username fields for activity logs.
  // In the fallback JSON db it is already resolved or stored flat.
  // For standard Prisma client, let's load users in a fast map.
  const users = await prisma.user.findMany();
  const logsWithUsers = activityLogs.map((log: any) => {
    const userObj = users.find((u: any) => u.id === log.userId);
    return {
      ...log,
      user: userObj ? { username: userObj.username } : { username: 'System' }
    };
  });

  const stats = {
    users: usersCount,
    portfolio: portfolioCount,
    news: newsCount,
    faqs: faqsCount
  };

  return (
    <DashboardClient stats={stats} initialLogs={logsWithUsers} />
  );
}
