import prisma from "../src/lib/prisma";

async function main() {
  // await Promise.all([
  //   prisma.users.upsert({
  //     where: { walletAddress: "rauchg@vercel.com" },
  //     update: {},
  //     create: {
  //       name: "Guillermo Rauch",
  //       walletAddress: "rauchg@vercel.com",
  //     },
  //   }),
  // ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
