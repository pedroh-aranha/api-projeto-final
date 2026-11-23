// prisma/seed.js: preenche a tabela modalidades com dados de exemplo.
// Rode com: npm run seed
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const modalidades = ['Musculação', 'Funcional', 'Yoga'];

for (const nome of modalidades) {
  await prisma.modalidade.upsert({
    where: { nome },
    update: {},
    create: { nome },
  });
}

console.log('Modalidades cadastradas:', modalidades.join(', '));
await prisma.$disconnect();