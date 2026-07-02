'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRetros() {
  try {
    const retros = await prisma.retroEntry.findMany({
      include: {
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedRetros = retros.map((r) => ({
      id: r.id,
      project: r.project.name,
      quote: r.quoted,
      actual: r.actual,
      recommendedRate: r.recommendedRate,
      notes: r.notes,
    }));

    return {
      success: true,
      data: formattedRetros,
    };
  } catch (error) {
    console.error('Failed to fetch retros:', error);
    return { success: false, error: 'Failed to load post-project retros.' };
  }
}
