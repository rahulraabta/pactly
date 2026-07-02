'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDelays() {
  try {
    const [entries, projects] = await Promise.all([
      prisma.delayEntry.findMany({
        include: {
          project: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.project.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const formattedEntries = entries.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      project: e.project.name,
      reason: e.reason,
      days: e.days,
      impactAmount: e.impactAmount,
      severity: e.severity as 'Low' | 'Medium' | 'High',
      date: e.date.toISOString().split('T')[0],
    }));

    return {
      success: true,
      data: {
        entries: formattedEntries,
        projects,
      },
    };
  } catch (error) {
    console.error('Failed to fetch delays:', error);
    return { success: false, error: 'Failed to load delay ledger entries.' };
  }
}

export async function logDelay(data: {
  projectId: string;
  reason: string;
  days: number;
  impactAmount: number;
  severity: 'Low' | 'Medium' | 'High';
  date: string;
}) {
  try {
    const newEntry = await prisma.delayEntry.create({
      data: {
        projectId: data.projectId,
        reason: data.reason,
        days: data.days,
        impactAmount: data.impactAmount,
        severity: data.severity,
        date: new Date(data.date),
      },
    });

    // Also register an activity for the project dashboard
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    if (project) {
      await prisma.activity.create({
        data: {
          action: `Logged client delay of ${data.days} days for ${project.name}`,
          projectId: data.projectId,
        },
      });
    }

    return { success: true, data: newEntry };
  } catch (error) {
    console.error('Failed to log delay:', error);
    return { success: false, error: 'Failed to log delay event.' };
  }
}
