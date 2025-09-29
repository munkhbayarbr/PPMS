/* prisma/seed.ts */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertRole(nameEn: string, nameMn?: string) {
  return prisma.role.upsert({
    where: { nameEn },
    update: { nameMn },
    create: { nameEn, nameMn },
  });
}

async function upsertUser(email: string, password: string, name?: string) {
  const hash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      email,
      name: name ?? email,
      password: hash,
      isActive: true,
    },
  });
}

async function ensureEmployeeRole(userId: string, roleId: string) {
  // @@unique([userId, roleId]) in schema
  return prisma.employeeRole.upsert({
    where: {
      userId_roleId: { userId, roleId },
    },
    update: {},
    create: { userId, roleId },
  });
}

async function seedReferenceData() {
  // Customers
  const customer = await prisma.customer.upsert({
    where: { email: 'contact@wool.mn' }, 
    update: { abbName: 'ABC' },
    create: {
      name: 'ABC Wool LLC',
      abbName: 'ABC',
      email: 'contact@wool.mn',
      phone: '+976-77112233',
      mobile: '+976-99112233',
      fax: '+976-11-123456',
      address: 'Ulaanbaatar, Khan-Uul, 15-r khoroo',
    },
  });

  // Fiber Types
  const cashmere = await prisma.fiberType.upsert({
    where: { name: 'Cashmere' },
    update: {},
    create: { name: 'Cashmere' },
  });

  // Fiber Colors
  const natWhite = await prisma.fiberColor.upsert({
    where: { name: 'Natural White' },
    update: {},
    create: { name: 'Natural White' },
  });

  // Out Colors (finished/dyed)
  const skyBlue = await prisma.outColor.upsert({
    where: { name: 'Sky Blue' },
    update: { abbName: 'SKY' },
    create: { name: 'Sky Blue', abbName: 'SKY' },
  });

  // Bobbins
  await prisma.bobbin.upsert({
    where: { name: 'Std 250g' },
    update: { weight: 0.25 },
    create: { name: 'Std 250g', weight: 0.25 },
  });
  await prisma.bobbin.upsert({
    where: { name: 'Light 150g' },
    update: { weight: 0.15 },
    create: { name: 'Light 150g', weight: 0.15 },
  });

  // Factory processes
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Dyeing' },
    update: { nameMn: 'Будах', abbre: 'P2' },
    create: { nameEn: 'Dyeing', nameMn: 'Будах', abbre: 'P2' },
  });
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Carding' },
    update: { nameMn: 'Самнах', abbre: 'P3' },
    create: { nameEn: 'Carding', nameMn: 'Самнах', abbre: 'P3' },
  });
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Spinning' },
    update: { nameMn: 'Ээрэх', abbre: 'P4' },
    create: { nameEn: 'Spinning', nameMn: 'Ээрэх', abbre: 'P4' },
  });
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Winding' },
    update: { nameMn: 'Ороох', abbre: 'P5' },
    create: { nameEn: 'Winding', nameMn: 'Ороох', abbre: 'P5' },
  });
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Doubling' },
    update: { nameMn: 'Давхарлах', abbre: 'P6' },
    create: { nameEn: 'Doubling', nameMn: 'Давхарлах', abbre: 'P6' },
  });
  await prisma.factoryProcess.upsert({
    where: { nameEn: 'Twisting' },
    update: { nameMn: 'Эрчлүүлэх', abbre: 'P7' },
    create: { nameEn: 'Twisting', nameMn: 'Эрчлүүлэх', abbre: 'P7' },
  });

  return { customer, cashmere, natWhite, skyBlue };
}

async function seedFlowAllStages(userId: string, refs: { customer: any; cashmere: any; natWhite: any; skyBlue: any }) {
  // === P1: Stock Intake ===
  const p1 = await prisma.p1Stock.create({
    data: {
      customerId: refs.customer.id,
      fiberTypeId: refs.cashmere.id,
      fiberColorId: refs.natWhite.id,
      orderAbb: null,
      dateTime: new Date(),
      baleNum: 2,
      roughWeight: 10,
      baleWeight: 9.8,
      conWeight: 9.6,
      moisture: 10,
      userId,
    },
  });

  // === P2: Dyeing (or Blending if you use that route) ===
  const lot = 'LOT-SEED-001';
  const p2 = await prisma.p2Dyeing.create({
    data: {
      lotNum: lot,
      colorId: refs.skyBlue.id,
      dateTime: new Date(),
      inRoughWeight: 9.6,
      p2FiberWeight: 9.1,
      p2Waste: 0.5,
      userId,
    },
  });

  // Link P1 -> P2
  await prisma.p1ToP2.create({
    data: {
      p1Id: p1.id,
      p2Id: p2.id,
      takenWeight: 9.6,
      moisture: 10,
      takenWeightCon: 9.6,
      roughWeight: 10,
    },
  });

  // === P3: Carding ===
  const p3 = await prisma.p3Carding.create({
    data: {
      lotNum: lot,
      batchNum: 1,
      dateTime: new Date(),
      inRoughWeight: 9.1,
      p3RovenWeight: 8.8,
      p3Waste: 0.3,
      bobbinNum: 20,
      userId,
    },
  });

  // Link P2 -> P3
  await prisma.p2ToP3.create({
    data: {
      p2Id: p2.id,
      p3Id: p3.id,
      takenWeight: 9.1,
      moisture: 9.5,
      takenWeightCon: 9.0,
    },
  });

  // === P4: Spinning ===
  const p4 = await prisma.p4Spinning.create({
    data: {
      lotNum: lot,
      batchNum: 1,
      dateTime: new Date(),
      inRoughWeight: 8.8,
      p4DanUtas: 4.2,
      p4RovenWeight: 4.3,
      p4Waste: 0.2,
      userId,
    },
  });

  // Link P3 -> P4
  await prisma.p3ToP4.create({
    data: {
      p3Id: p3.id,
      p4Id: p4.id,
      takenWeight: 8.8,
      moisture: 9.0,
      takenWeightCon: 8.7,
    },
  });

  // === P5: Winding ===
  const p5 = await prisma.p5Winding.create({
    data: {
      lotNum: lot,
      batchNum: 1,
      dateTime: new Date(),
      inRoughWeight: 8.7,
      p5OroosonUtas: 8.5,
      userId,
    },
  });

  // Link P4 -> P5
  await prisma.p4ToP5.create({
    data: {
      p4Id: p4.id,
      p5Id: p5.id,
      takenWeight: 8.7,
      moisture: 8.8,
      takenWeightCon: 8.6,
    },
  });

  // === P6: Doubling ===
  const p6 = await prisma.p6Doubling.create({
    data: {
      lotNum: lot,
      batchNum: 1,
      dateTime: new Date(),
      inRoughWeight: 8.6,
      p5DavharUtas: 8.4,
      userId,
    },
  });

  // Link P5 -> P6
  await prisma.p5ToP6.create({
    data: {
      p5Id: p5.id,
      p6Id: p6.id,
      takenWeight: 8.6,
      moisture: 8.5,
      takenWeightCon: 8.5,
    },
  });

  // === P7: Twisting ===
  const p7 = await prisma.p7Twisting.create({
    data: {
      lotNum: lot,
      batchNum: 1,
      dateTime: new Date(),
      inRoughWeight: 8.5,
      p5BelenUtas: 8.3,
      userId,
    },
  });

  // Link P6 -> P7
  await prisma.p6ToP7.create({
    data: {
      p6Id: p6.id,
      p7Id: p7.id,
      takenWeight: 8.5,
      moisture: 8.4,
      takenWeightCon: 8.4,
    },
  });

  return { lot, p1, p2, p3, p4, p5, p6, p7 };
}

async function main() {
  console.log('⏳ Seeding…');

  // 1) Roles & Users
  const [adminRole, managerRole, operatorRole] = await Promise.all([
    upsertRole('Admin', 'Админ'),
    upsertRole('Manager', 'Менежер'),
    upsertRole('Operator', 'Оператор'),
  ]);

  const admin = await upsertUser('admin@gmail.com', 'admin123', 'Admin');
  const mgr   = await upsertUser('manager@ppms.local', 'manager123', 'Manager One');
  const op    = await upsertUser('operator@ppms.local', 'operator123', 'Operator One');

  await Promise.all([
    ensureEmployeeRole(admin.id, adminRole.id),
    ensureEmployeeRole(mgr.id, managerRole.id),
    ensureEmployeeRole(op.id, operatorRole.id),
  ]);

  // 2) Reference data
  const refs = await seedReferenceData();

  // 3) Full P1→P7 flow (lot)
  const flow = await seedFlowAllStages(admin.id, refs);

  console.log('✅ Seed complete.');
  console.log('   Admin:', admin.email);
  console.log('   Manager:', mgr.email);
  console.log('   Operator:', op.email);
  console.log('   Lot seeded:', flow.lot);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// // import { PrismaClient } from '@prisma/client';
// // const prisma = new PrismaClient();

// // async function main() {
// //   const roles = ['admin', 'manager', 'operator', 'viewer'];
// //   for (const nameEn of roles) {
// //     await prisma.role.upsert({
// //       where: { nameEn },
// //       update: {},
// //       create: { nameEn },
// //     });
// //   }
// //   console.log('Seeded roles:', roles.join(', '));
// // }
// // main().finally(() => prisma.$disconnect());

// import { PrismaClient, Role } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   // Default admin credentials
//   const email = 'admin@gmail.com';
//   const plainPassword = 'admin123';
//   const password = await bcrypt.hash(plainPassword, 12);

//   // Create or ensure an ADMIN user exists
//   const admin = await prisma.user.upsert({
//     where: { email },
//     update: {},
//     create: {
//       email,
//       password,
//       name: 'Admin',
//     },
//   });

//   console.log('✅ Seeded user:', {
//     id: admin.id,
//     email: admin.email,
//   });
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed error:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
