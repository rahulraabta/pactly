'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMilestones() {
  try {
    const milestones = await prisma.milestone.findMany({
      include: {
        project: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    const formattedMilestones = milestones.map((m) => ({
      id: m.id,
      project: m.project.name,
      title: m.title,
      amount: m.amount,
      dueDate: m.dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      status: m.status as 'LOCKED' | 'PENDING' | 'RELEASED',
    }));

    return {
      success: true,
      data: formattedMilestones,
    };
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    return { success: false, error: 'Failed to load milestones.' };
  }
}
