'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBoardData() {
  try {
    const [tasks, projects] = await Promise.all([
      prisma.boardTask.findMany({
        include: {
          project: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.project.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const formattedTasks = tasks.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      project: t.project.name,
      title: t.title,
      priority: t.priority as 'Low' | 'Medium' | 'High' | 'Urgent',
      dueDate: t.dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      column: t.column as 'Backlog' | 'In Progress' | 'Review' | 'Done',
    }));

    return {
      success: true,
      data: {
        tasks: formattedTasks,
        projects,
      },
    };
  } catch (error) {
    console.error('Failed to fetch board data:', error);
    return { success: false, error: 'Failed to load board data.' };
  }
}

export async function updateTaskColumn(taskId: string, newCol: 'Backlog' | 'In Progress' | 'Review' | 'Done') {
  try {
    const updatedTask = await prisma.boardTask.update({
      where: { id: taskId },
      data: { column: newCol },
      include: { project: true },
    });

    // Create an activity
    await prisma.activity.create({
      data: {
        action: `Moved task "${updatedTask.title}" to ${newCol} for ${updatedTask.project.name}`,
        projectId: updatedTask.projectId,
      },
    });

    return { success: true, data: updatedTask };
  } catch (error) {
    console.error('Failed to update task column:', error);
    return { success: false, error: 'Failed to update task column.' };
  }
}
