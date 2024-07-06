import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}
const url = process.env.TURSO_DATABASE_URL as string;
const authToken = process.env.TURSO_AUTH_TOKEN as string;

if (process.env.NODE_ENV === 'production') {
  const libsql = createClient({
    url,
    authToken,
  });

  const adapter = new PrismaLibSQL(libsql);
  global.db = new PrismaClient({ adapter });
} else {
  global.db = new PrismaClient({});
}
export const db = global.db || new PrismaClient({});

if (process.env.NODE_ENV !== 'production') global.db = db;
