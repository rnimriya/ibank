import { PrismaClient } from "../app/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash("demo123", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@convertstatement.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@convertstatement.com",
      passwordHash,
      role: "USER",
    },
  });

  console.log(`✅ Demo user created: ${demoUser.email}`);

  // 2. Create Subscription (Pro Plan)
  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      planType: "PRO",
      pagesLimit: 300,
      pagesUsed: 155,
      billingCycleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Pro subscription created");

  // 3. Delete existing conversions for clean seed
  await prisma.conversion.deleteMany({ where: { userId: demoUser.id } });

  // 4. Seed Conversion History with international bank data
  const conversions = [
    {
      userId: demoUser.id,
      bankName: "JPMorgan Chase",
      fileName: "Chase_Checking_Oct_Dec.pdf",
      pagesProcessed: 12,
      exportFormat: "CSV",
      processingTimeMs: 8420,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      userId: demoUser.id,
      bankName: "Bank of America",
      fileName: "BofA_Corporate_FY23.pdf",
      pagesProcessed: 45,
      exportFormat: "XLSX",
      processingTimeMs: 14200,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      userId: demoUser.id,
      bankName: "HSBC",
      fileName: "HSBC_Credit_Card_Nov.pdf",
      pagesProcessed: 3,
      exportFormat: "OFX",
      processingTimeMs: 3100,
      status: "completed",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      userId: demoUser.id,
      bankName: "Barclays",
      fileName: "Barclays_Business_Q2.pdf",
      pagesProcessed: 75,
      exportFormat: "CSV",
      processingTimeMs: 12800,
      status: "completed",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      userId: demoUser.id,
      bankName: "Citibank",
      fileName: "Citi_Wealth_Summary_2023.pdf",
      pagesProcessed: 18,
      exportFormat: "XLSX",
      processingTimeMs: 9600,
      status: "completed",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId: demoUser.id,
      bankName: "Wells Fargo",
      fileName: "WellsFargo_Savings.pdf",
      pagesProcessed: 2,
      exportFormat: "QFX",
      processingTimeMs: 2400,
      status: "completed",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const conv of conversions) {
    await prisma.conversion.create({ data: conv });
  }

  console.log(`✅ ${conversions.length} conversion records seeded`);
  console.log("\n🎉 Seeding complete!");
  console.log("   Demo Account: demo@convertstatement.com / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
