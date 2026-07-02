'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRunways() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    const runways = projects.map((p) => {
      const budget = p.budget || 0;
      const spent = p.spent || 0;
      const remaining = budget - spent;
      const burnPercentage = budget > 0 ? (spent / budget) * 100 : 0;

      let risk: 'Safe' | 'Warning' | 'Critical' = 'Safe';
      if (burnPercentage > 75) {
        risk = 'Critical';
      } else if (burnPercentage >= 50) {
        risk = 'Warning';
      }

      return {
        id: p.id,
        project: p.name,
        budget,
        spent,
        remaining,
        burnPercentage,
        risk,
      };
    });

    return {
      success: true,
      data: runways,
    };
  } catch (error) {
    console.error('Failed to fetch runway data:', error);
    return { success: false, error: 'Failed to load runway statistics.' };
  }
}
