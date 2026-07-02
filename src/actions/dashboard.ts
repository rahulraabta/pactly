'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardData() {
  try {
    // 1. Fetch Revenue Data (Last 6 months)
    const revenueEntries = await prisma.revenueEntry.findMany({
      orderBy: [
        { year: 'desc' },
        { id: 'desc' } // proxy for insertion order to get last 6, sqlite doesn't easily sort text months
      ],
      take: 6,
    });
    // Reverse to get chronological order for the chart
    const revenueData = revenueEntries.reverse().map(e => ({ month: e.month, revenue: e.revenue }));

    // 2. Fetch Project Health
    const projects = await prisma.project.findMany();
    const healthCount = projects.reduce((acc, p) => {
      acc[p.health] = (acc[p.health] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectHealthData = [
      { name: 'Healthy', value: healthCount['Healthy'] || 0, color: 'var(--success)' },
      { name: 'Warning', value: healthCount['Warning'] || 0, color: 'var(--warning)' },
      { name: 'Critical', value: healthCount['Critical'] || 0, color: 'var(--danger)' },
    ].filter(h => h.value > 0);

    // 3. Fetch Upcoming Milestones (only Pending)
    const milestones = await prisma.milestone.findMany({
      include: { project: true },
      where: { status: 'Pending' },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });
    const upcomingMilestones = milestones.map(m => ({
      id: m.id,
      project: m.project.name,
      amount: `₹${m.amount.toLocaleString()}`,
      dueDate: m.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      statusColor: m.project.health === 'Healthy' ? 'var(--success)' : (m.project.health === 'Warning' ? 'var(--warning)' : 'var(--danger)'),
    }));

    // 4. Fetch Recent Activity
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 7,
    });
    
    const now = new Date().getTime();
    const recentActivity = activities.map(a => {
      const diffHrs = Math.floor((now - a.createdAt.getTime()) / 3600000);
      const timeStr = diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs/24)}d ago`;
      return {
        id: a.id,
        action: a.action,
        time: diffHrs === 0 ? 'Just now' : timeStr,
      };
    });

    // KPIs calculation
    const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
    const atRiskCount = projects.filter(p => p.status === 'At-Risk').length;
    const totalMonthlyRevenue = revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue : 0;
    const avgBurnRate = projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.burnRate, 0) / projects.length) : 0;
    
    // Total unpaid represents all pending milestones
    const allPendingMilestones = await prisma.milestone.aggregate({
      where: { status: 'Pending' },
      _sum: { amount: true }
    });
    const totalUnpaid = allPendingMilestones._sum.amount || 0;

    return {
      success: true,
      data: {
        revenueData,
        projectHealthData,
        upcomingMilestones,
        recentActivity,
        kpis: {
          activeProjects: activeProjectsCount,
          monthlyRevenue: `₹${totalMonthlyRevenue.toLocaleString()}`,
          atRisk: atRiskCount,
          avgBurnRate: `${avgBurnRate}%`,
          totalUnpaid: `₹${totalUnpaid.toLocaleString()}`,
        }
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return { success: false, error: 'Failed to load dashboard data.' };
  }
}
