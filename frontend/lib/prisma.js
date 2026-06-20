import Database from "better-sqlite3";
import path from "node:path";

const globalForDb = globalThis;
const dbPath = path.join(process.cwd(), "dev.db");
const db = globalForDb.db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

// Initialize missing tables dynamically
db.exec(`
  CREATE TABLE IF NOT EXISTS Rule (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    keyword TEXT NOT NULL,
    category TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )
`);

const prisma = {
  rule: {
    findMany: async ({ where }) => {
      if (where?.userId) {
        return db.prepare('SELECT * FROM Rule WHERE userId = ? ORDER BY createdAt DESC').all(where.userId);
      }
      return [];
    },
    create: async ({ data }) => {
      const id = require('crypto').randomUUID();
      db.prepare('INSERT INTO Rule (id, userId, keyword, category) VALUES (?, ?, ?, ?)')
        .run(id, data.userId, data.keyword, data.category);
      return { id, ...data };
    },
    delete: async ({ where }) => {
      if (where?.id) {
        db.prepare('DELETE FROM Rule WHERE id = ?').run(where.id);
        return { id: where.id };
      }
    }
  },
  user: {
    findUnique: async ({ where, include }) => {
      let user = null;
      if (where.email) {
        user = db.prepare('SELECT * FROM User WHERE email = ?').get(where.email);
      } else if (where.id) {
        user = db.prepare('SELECT * FROM User WHERE id = ?').get(where.id);
      }
      
      if (!user) return null;

      if (include) {
        if (include.subscription) {
          user.subscription = db.prepare('SELECT * FROM Subscription WHERE userId = ?').get(user.id) || null;
        }
        if (include.conversions) {
          let query = 'SELECT * FROM Conversion WHERE userId = ?';
          if (include.conversions.orderBy?.createdAt === 'desc') {
            query += ' ORDER BY createdAt DESC';
          }
          if (include.conversions.take) {
            query += ` LIMIT ${include.conversions.take}`;
          }
          user.conversions = db.prepare(query).all(user.id);
        }
      }
      return user;
    }
  },
  subscription: {
    findUnique: async ({ where }) => {
      if (where.userId) {
        return db.prepare('SELECT * FROM Subscription WHERE userId = ?').get(where.userId) || null;
      }
      return null;
    }
  },
  conversion: {
    findMany: async ({ where, orderBy }) => {
      let query = 'SELECT * FROM Conversion WHERE 1=1';
      const params = [];
      
      if (where?.userId) {
        query += ' AND userId = ?';
        params.push(where.userId);
      }
      
      if (orderBy?.createdAt === 'desc') {
        query += ' ORDER BY createdAt DESC';
      } else if (orderBy?.createdAt === 'asc') {
        query += ' ORDER BY createdAt ASC';
      }
      
      return db.prepare(query).all(...params);
    }
  }
};

export default prisma;
