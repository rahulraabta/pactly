'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const formattedClients = clients.map((c) => {
      let riskFlags: string[] = [];
      try {
        riskFlags = JSON.parse(c.riskFlags || '[]');
      } catch (err) {
        console.error('Failed to parse risk flags for client:', c.id, err);
      }

      return {
        id: c.id,
        name: c.name,
        healthScore: c.healthScore,
        lastActivity: c.lastActivity.toISOString().split('T')[0],
        riskFlags,
      };
    });

    return {
      success: true,
      data: formattedClients,
    };
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return { success: false, error: 'Failed to load clients.' };
  }
}
