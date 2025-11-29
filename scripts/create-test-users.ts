import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

async function createTestUsers() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create GESTOR user
    const gestor = await prisma.user.upsert({
      where: { email: 'gestor@test.com' },
      update: {},
      create: {
        email: 'gestor@test.com',
        password: hashedPassword,
        name: 'Test Gestor',
        role: 'GESTOR',
      },
    });

    // Create ADMIN user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Test Admin',
        role: 'ADMIN',
      },
    });

    console.log('✅ Test users created successfully:');
    console.log('');
    console.log('GESTOR Account:');
    console.log('  Email: gestor@test.com');
    console.log('  Password: password123');
    console.log(`  ID: ${gestor.id}`);
    console.log('');
    console.log('ADMIN Account:');
    console.log('  Email: admin@test.com');
    console.log('  Password: password123');
    console.log(`  ID: ${admin.id}`);
    console.log('');
    console.log('🎉 You can now sign in with these credentials!');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
