const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

const dbPath = path.join(__dirname, "..", "dev.db");
const db = new Database(dbPath);

function cuid() {
  return crypto.randomBytes(16).toString("hex");
}

async function main() {
  console.log("🌱 Seeding database...");
  console.log(`   Using database: ${dbPath}`);

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash("demo123", 10);
  const userId = cuid();

  // Check if user already exists
  const existingUser = db.prepare("SELECT id FROM User WHERE email = ?").get("demo@convertstatement.com");
  
  let finalUserId;
  if (existingUser) {
    finalUserId = existingUser.id;
    console.log("✅ Demo user already exists, skipping creation");
  } else {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO User (id, name, email, passwordHash, role, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, "Demo User", "demo@convertstatement.com", passwordHash, "USER", now, now);
    finalUserId = userId;
    console.log("✅ Demo user created: demo@convertstatement.com");
  }

  // 2. Create Subscription (Pro Plan)
  const existingSub = db.prepare("SELECT id FROM Subscription WHERE userId = ?").get(finalUserId);
  if (!existingSub) {
    const now = new Date().toISOString();
    const billingEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO Subscription (id, userId, planType, pagesLimit, pagesUsed, billingCycleEnd, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(cuid(), finalUserId, "PRO", 300, 155, billingEnd, now, now);
    console.log("✅ Pro subscription created (300 pages, 155 used)");
  } else {
    console.log("✅ Subscription already exists, skipping creation");
  }

  // 3. Delete existing conversions for clean seed
  db.prepare("DELETE FROM Conversion WHERE userId = ?").run(finalUserId);

  // 4. Seed Conversion History with international bank data
  const conversions = [
    { bankName: "JPMorgan Chase",  fileName: "Chase_Checking_Oct_Dec.pdf",  pages: 12, format: "CSV",  timeMs: 8420,  daysAgo: 0 },
    { bankName: "Bank of America", fileName: "BofA_Corporate_FY23.pdf",     pages: 45, format: "XLSX", timeMs: 14200, daysAgo: 0.08 },
    { bankName: "HSBC",            fileName: "HSBC_Credit_Card_Nov.pdf",    pages: 3,  format: "OFX",  timeMs: 3100,  daysAgo: 1 },
    { bankName: "Barclays",        fileName: "Barclays_Business_Q2.pdf",    pages: 75, format: "CSV",  timeMs: 12800, daysAgo: 3 },
    { bankName: "Citibank",        fileName: "Citi_Wealth_Summary_2023.pdf",pages: 18, format: "XLSX", timeMs: 9600,  daysAgo: 7 },
    { bankName: "Wells Fargo",     fileName: "WellsFargo_Savings.pdf",      pages: 2,  format: "QFX",  timeMs: 2400,  daysAgo: 14 },
  ];

  const insertConv = db.prepare(`
    INSERT INTO Conversion (id, userId, bankName, fileName, pagesProcessed, exportFormat, processingTimeMs, status, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of conversions) {
    const createdAt = new Date(Date.now() - c.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    insertConv.run(cuid(), finalUserId, c.bankName, c.fileName, c.pages, c.format, c.timeMs, "completed", createdAt);
  }

  console.log(`✅ ${conversions.length} conversion records seeded`);
  console.log("\n🎉 Seeding complete!");
  console.log("   ──────────────────────────────────────────");
  console.log("   Demo Account:  demo@convertstatement.com");
  console.log("   Password:      demo123");
  console.log("   Plan:          Pro (155/300 pages used)");
  console.log("   ──────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
