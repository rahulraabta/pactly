'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getChangeOrders() {
  try {
    const [changeOrders, projects] = await Promise.all([
      prisma.changeOrder.findMany({
        include: { project: true },
        orderBy: { date: 'desc' },
      }),
      prisma.project.findMany({
        select: { id: true, name: true },
      }),
    ]);

    const formattedChangeOrders = changeOrders.map((co) => ({
      id: co.id,
      projectId: co.projectId,
      project: co.project.name,
      description: co.description,
      costImpact: co.costImpact,
      status: co.status as 'Approved' | 'Pending' | 'Rejected',
      date: co.date.toISOString().split('T')[0],
    }));

    return {
      success: true,
      data: {
        changeOrders: formattedChangeOrders,
        projects,
      },
    };
  } catch (error) {
    console.error('Failed to fetch change orders:', error);
    return { success: false, error: 'Failed to load change orders.' };
  }
}

export async function addChangeOrder(data: {
  projectId: string;
  description: string;
  costImpact: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}) {
  try {
    const newCo = await prisma.changeOrder.create({
      data: {
        projectId: data.projectId,
        description: data.description,
        costImpact: data.costImpact,
        status: data.status,
        date: new Date(data.date),
      },
    });

    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (project) {
      // Create project activity
      await prisma.activity.create({
        data: {
          action: `Requested scope change: "${data.description}" for ${project.name} (${data.status})`,
          projectId: data.projectId,
        },
      });
    }

    return { success: true, data: newCo };
  } catch (error) {
    console.error('Failed to add change order:', error);
    return { success: false, error: 'Failed to add change order.' };
  }
}
