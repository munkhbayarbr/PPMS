import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@local';
  const password = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, role: 'ADMIN', name: 'Admin' },
  });

  console.log('Seeded admin: admin@local / admin123');
}

main().finally(() => prisma.$disconnect());
