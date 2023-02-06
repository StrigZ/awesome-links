import { PrismaClient } from "@prisma/client";
import { links } from "../data/links";
const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
async function main() {
  await prisma.user.create({
    data: {
      email: "test2@gmail.com",
      role: "ADMIN",
    },
  });

  await prisma.link.createMany({
    data: links,
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
