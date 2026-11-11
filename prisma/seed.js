const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.book.count();

  if (count === 0) {
    await prisma.book.createMany({
      data: [
        { title: "Laskar Pelangi", author: "Andrea Hirata", year: 2005 },
        { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", year: 1980 }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
