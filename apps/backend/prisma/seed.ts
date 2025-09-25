import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@gmail.com';
  const password = await bcrypt.hash('test123', 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, role: 'ADMIN', name: 'Admin' },
  });

}

main().finally(() => prisma.$disconnect());
