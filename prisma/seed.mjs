import { PrismaClient } from "@prisma/client";
import data from "./dev-data";

const { potAccess, pots, friends, users, sessions } = data;

const prisma = new PrismaClient();

async function seed() {
  await prisma.potAccess.deleteMany();
  await prisma.pots.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.sessions.deleteMany();
  await prisma.pots.createMany({
    data: pots,
  });
  await prisma.potAccess.createMany({
    data: potAccess,
  });
  await prisma.friendship.createMany({
    data: friends,
  });
  await prisma.sessions.createMany({
    data: sessions,
  });
}
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
