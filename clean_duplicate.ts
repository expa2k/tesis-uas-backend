import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const proyectos = await prisma.proyectos.findMany({
    include: {
      proyecto_estudiantes: true
    }
  });

  const seen = new Set();
  let deletedCount = 0;

  for (const p of proyectos) {
    // A simple key based on title and director ID
    const key = `${p.titulo}-${p.id_director}`;
    
    if (seen.has(key)) {
      console.log(`Deleting duplicate project: ${p.titulo} (ID: ${p.id_proyecto})`);
      await prisma.proyectos.delete({
        where: { id_proyecto: p.id_proyecto }
      });
      deletedCount++;
    } else {
      seen.add(key);
    }
  }

  console.log(`Deleted ${deletedCount} duplicate projects.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
