import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.activity.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.revenueEntry.deleteMany();

  console.log('Seeding massive dataset...');

  // Create 10 Clients
  const clients = [];
  for (let i = 1; i <= 10; i++) {
    clients.push(await prisma.client.create({
      data: { name: `Client Name ${i}`, company: `Enterprise Corp ${i}` },
    }));
  }

  // Create 25 Projects across clients
  const projects = [];
  const statuses = ['Active', 'Active', 'Active', 'At-Risk', 'Completed'];
  const healths = ['Healthy', 'Healthy', 'Warning', 'Critical'];
  
  for (let i = 1; i <= 25; i++) {
    projects.push(await prisma.project.create({
      data: {
        name: `Major SaaS Integration Phase ${i}`,
        status: statuses[i % statuses.length],
        health: healths[i % healths.length],
        burnRate: Math.floor(Math.random() * 40) + 60, // 60 to 100
        clientId: clients[i % clients.length].id,
      },
    }));
  }

  // Create 100 Milestones
  const now = new Date();
  const milestonesData = [];
  for (let i = 1; i <= 100; i++) {
    const daysOffset = (i * 2) - 30; // some past, some future
    milestonesData.push({
      title: `Deliverable ${i}: Feature Set`,
      amount: Math.floor(Math.random() * 50000) + 10000,
      dueDate: new Date(now.getTime() + daysOffset * 86400000),
      status: daysOffset < 0 ? 'Paid' : (daysOffset < 10 ? 'Approved' : 'Pending'),
      projectId: projects[i % projects.length].id,
    });
  }
  await prisma.milestone.createMany({ data: milestonesData });

  // Create 150 Activities
  const activitiesData = [];
  const actionTypes = [
    'approved milestone', 'requested scope change', 'released payment of', 
    'logged client delay', 'completed sprint retro', 'uploaded final assets',
    'signed new SOW', 'flagged critical bug'
  ];
  for (let i = 1; i <= 150; i++) {
    const daysOffset = -(Math.floor(Math.random() * 30));
    activitiesData.push({
      action: `Client ${actionTypes[i % actionTypes.length]} for Phase ${i % 5}`,
      projectId: projects[i % projects.length].id,
      createdAt: new Date(now.getTime() + daysOffset * 86400000),
    });
  }
  await prisma.activity.createMany({ data: activitiesData });

  // Create 12 Months of Revenue History
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueData = [];
  for (let i = 0; i < 12; i++) {
    revenueData.push({
      month: months[i],
      year: 2025,
      revenue: Math.floor(Math.random() * 60000) + 40000, // 40k to 100k
    });
  }
  // Add 2026 data
  for (let i = 0; i < 6; i++) {
    revenueData.push({
      month: months[i],
      year: 2026,
      revenue: Math.floor(Math.random() * 80000) + 50000, // 50k to 130k
    });
  }
  await prisma.revenueEntry.createMany({ data: revenueData });

  console.log('Massive seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
