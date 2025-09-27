import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Default admin credentials
  const email = 'admin@gmail.com';
  const plainPassword = 'admin123';
  const password = await bcrypt.hash(plainPassword, 12);

  // Create or ensure an ADMIN user exists
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: 'Admin',
    },
  });

  console.log('✅ Seeded user:', {
    id: admin.id,
    email: admin.email,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
