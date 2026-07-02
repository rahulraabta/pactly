import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');
  await prisma.activity.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.delayEntry.deleteMany();
  await prisma.changeOrder.deleteMany();
  await prisma.boardTask.deleteMany();
  await prisma.retroEntry.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.revenueEntry.deleteMany();

  console.log('Seeding database with high-fidelity SaaS dataset...');

  // Create 5 main Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Sunrise Exports (Rahul)',
      company: 'Sunrise Exports',
      contactName: 'Rahul',
      healthScore: 92,
      riskFlags: JSON.stringify(['Active Escrow', 'On Track']),
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Neon Tech (Priya)',
      company: 'Neon Tech',
      contactName: 'Priya',
      healthScore: 85,
      riskFlags: JSON.stringify(['Milestone Signed']),
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Prism Media (Amit)',
      company: 'Prism Media',
      contactName: 'Amit',
      healthScore: 65,
      riskFlags: JSON.stringify(['Scope Dispute', 'Slow Feedback']),
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: 'Aether Agency (Sneha)',
      company: 'Aether Agency',
      contactName: 'Sneha',
      healthScore: 38,
      riskFlags: JSON.stringify(['Delayed Payment', 'Critical Blocker']),
    },
  });

  const client5 = await prisma.client.create({
    data: {
      name: 'TechFlow Solutions (Vikram)',
      company: 'TechFlow Solutions',
      contactName: 'Vikram',
      healthScore: 80,
      riskFlags: JSON.stringify(['Weekly Sync Done']),
    },
  });

  // Create 5 Projects corresponding to clients
  const p1 = await prisma.project.create({
    data: {
      name: 'Sunrise Portal',
      status: 'Active',
      health: 'Critical',
      burnRate: 86.67,
      budget: 300000,
      spent: 260000,
      clientId: client1.id,
    },
  });

  const p2 = await prisma.project.create({
    data: {
      name: 'Neon Labs',
      status: 'Active',
      health: 'Critical',
      burnRate: 84.0,
      budget: 250000,
      spent: 210000,
      clientId: client2.id,
    },
  });

  const p3 = await prisma.project.create({
    data: {
      name: 'Prism Media',
      status: 'At-Risk',
      health: 'Critical',
      burnRate: 80.56,
      budget: 180000,
      spent: 145000,
      clientId: client3.id,
    },
  });

  const p4 = await prisma.project.create({
    data: {
      name: 'Aether Branding',
      status: 'At-Risk',
      health: 'Warning',
      burnRate: 60.0,
      budget: 120000,
      spent: 72000,
      clientId: client4.id,
    },
  });

  const p5 = await prisma.project.create({
    data: {
      name: 'TechFlow API',
      status: 'Active',
      health: 'Healthy',
      burnRate: 40.0,
      budget: 80000,
      spent: 32000,
      clientId: client5.id,
    },
  });

  const projects = [p1, p2, p3, p4, p5];

  // Create Milestones (including locked and released escrow)
  const milestonesData = [
    {
      title: 'Database Architecture & Replica Setup',
      amount: 120000,
      dueDate: new Date('2026-06-10'),
      status: 'LOCKED',
      projectId: p1.id,
    },
    {
      title: 'Biometric Login UX & Integration',
      amount: 140000,
      dueDate: new Date('2026-06-15'),
      status: 'LOCKED',
      projectId: p2.id,
    },
    {
      title: 'Checkout Localization & Subscriptions',
      amount: 100000,
      dueDate: new Date('2026-06-20'),
      status: 'LOCKED',
      projectId: p3.id,
    },
    {
      title: 'Brand Strategy Deck & Vector Guidelines',
      amount: 75000,
      dueDate: new Date('2026-06-28'),
      status: 'PENDING',
      projectId: p4.id,
    },
    {
      title: 'API Auth Flow Security Verification',
      amount: 50000,
      dueDate: new Date('2026-07-05'),
      status: 'PENDING',
      projectId: p5.id,
    },
    {
      title: 'Wireframes Signoff & Initial Design Prototype',
      amount: 95000,
      dueDate: new Date('2026-05-25'),
      status: 'RELEASED',
      projectId: p1.id,
    },
  ];

  for (const m of milestonesData) {
    await prisma.milestone.create({ data: m });
  }

  // Create Delay Ledger entries
  const delayEntries = [
    {
      reason: 'Delayed feedback on dashboard wireframes & core portal layouts',
      days: 12,
      impactAmount: 85000,
      severity: 'High',
      date: new Date('2026-05-28'),
      projectId: p1.id,
    },
    {
      reason: 'Client API credential handover and sandbox access latency',
      days: 8,
      impactAmount: 40000,
      severity: 'Medium',
      date: new Date('2026-05-24'),
      projectId: p2.id,
    },
    {
      reason: 'Marketing copy assets & product high-res media files overdue',
      days: 6,
      impactAmount: 25000,
      severity: 'Medium',
      date: new Date('2026-05-20'),
      projectId: p3.id,
    },
    {
      reason: 'Brand focus group alignment workshop rescheduling requested',
      days: 5,
      impactAmount: 15000,
      severity: 'Low',
      date: new Date('2026-05-15'),
      projectId: p4.id,
    },
    {
      reason: 'Partner API staging access verification bottleneck',
      days: 3,
      impactAmount: 0,
      severity: 'Low',
      date: new Date('2026-05-10'),
      projectId: p5.id,
    },
  ];

  for (const entry of delayEntries) {
    await prisma.delayEntry.create({ data: entry });
  }

  // Create Change Orders (Scope Shield)
  const changeOrders = [
    {
      description: 'Extra database backup replication node setup',
      costImpact: 45000,
      status: 'Approved',
      date: new Date('2026-05-28'),
      projectId: p1.id,
    },
    {
      description: 'Biometrics login support (FaceID/Fingerprint)',
      costImpact: 60000,
      status: 'Approved',
      date: new Date('2026-05-24'),
      projectId: p2.id,
    },
    {
      description: 'Multi-currency checkout localization',
      costImpact: 50000,
      status: 'Pending',
      date: new Date('2026-05-20'),
      projectId: p3.id,
    },
    {
      description: 'Animated logo variation iterations',
      costImpact: 25000,
      status: 'Rejected',
      date: new Date('2026-05-15'),
      projectId: p4.id,
    },
    {
      description: 'Stripe invoice recurring sub-webhooks integration',
      costImpact: 140000,
      status: 'Approved',
      date: new Date('2026-05-10'),
      projectId: p1.id,
    },
  ];

  for (const co of changeOrders) {
    await prisma.changeOrder.create({ data: co });
  }

  // Create Kanban Board Tasks
  const boardTasks = [
    {
      title: 'Database migration checks and schema syncing',
      priority: 'Low',
      dueDate: new Date('2026-06-12'),
      column: 'Backlog',
      projectId: p1.id,
    },
    {
      title: 'Figma wireframe assets export and localization prep',
      priority: 'Medium',
      dueDate: new Date('2026-06-18'),
      column: 'Backlog',
      projectId: p3.id,
    },
    {
      title: 'Implement biometrics login FaceID/TouchID checks',
      priority: 'High',
      dueDate: new Date('2026-06-10'),
      column: 'In Progress',
      projectId: p2.id,
    },
    {
      title: 'Checkout payment flow webhook validation',
      priority: 'Urgent',
      dueDate: new Date('2026-06-08'),
      column: 'In Progress',
      projectId: p3.id,
    },
    {
      title: 'Security compliance auditing and SSL setup',
      priority: 'High',
      dueDate: new Date('2026-06-05'),
      column: 'Review',
      projectId: p1.id,
    },
    {
      title: 'API endpoint staging documentation',
      priority: 'Low',
      dueDate: new Date('2026-06-06'),
      column: 'Review',
      projectId: p2.id,
    },
    {
      title: 'Initial workspace scaffolding and routing setup',
      priority: 'Low',
      dueDate: new Date('2026-05-25'),
      column: 'Done',
      projectId: p1.id,
    },
    {
      title: 'Landing page layout design signoff',
      priority: 'Medium',
      dueDate: new Date('2026-05-28'),
      column: 'Done',
      projectId: p3.id,
    },
  ];

  for (const t of boardTasks) {
    await prisma.boardTask.create({ data: t });
  }

  // Create Post-Project Retro Entries
  const retroEntries = [
    {
      quoted: 200000,
      actual: 240000,
      recommendedRate: 2500,
      notes: 'ScopeShield successfully captured ₹40,000 in approved change orders.',
      projectId: p1.id,
    },
    {
      quoted: 150000,
      actual: 180000,
      recommendedRate: 2200,
      notes: 'Client signed off on all milestones within 24 hours of notification.',
      projectId: p2.id,
    },
    {
      quoted: 120000,
      actual: 95000,
      recommendedRate: 2000,
      notes: 'Significant delay in asset delivery caused scope leak and schedule slippage.',
      projectId: p3.id,
    },
    {
      quoted: 80000,
      actual: 75000,
      recommendedRate: 1800,
      notes: 'Underestimated logo revision cycles. Recommend setting capping rules.',
      projectId: p4.id,
    },
    {
      quoted: 100050,
      actual: 120000,
      recommendedRate: 2800,
      notes: 'Fast integration via reuse of standard DB scaffold schemas.',
      projectId: p5.id,
    },
  ];

  for (const r of retroEntries) {
    await prisma.retroEntry.create({ data: r });
  }

  // Create Recent Activities
  const now = new Date();
  const activitiesData = [
    {
      action: 'Client approved milestone for Sunrise Portal',
      projectId: p1.id,
      createdAt: new Date(now.getTime() - 2 * 3600000), // 2h ago
    },
    {
      action: 'Client requested scope change for Prism Media',
      projectId: p3.id,
      createdAt: new Date(now.getTime() - 5 * 3600000), // 5h ago
    },
    {
      action: 'Logged client delay for Neon Labs',
      projectId: p2.id,
      createdAt: new Date(now.getTime() - 10 * 3600000), // 10h ago
    },
    {
      action: 'Completed sprint retro for TechFlow API',
      projectId: p5.id,
      createdAt: new Date(now.getTime() - 24 * 3600000), // 1d ago
    },
  ];
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

  console.log('Massive high-fidelity seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
