import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

if (!global.db) {
  const libsql =
    process.env.NODE_ENV === "production"
      ? createClient({
          url: (process.env.TURSO_DATABASE_URL as string).replace(
            "libsql://",
            "https://"
          ),
          authToken: process.env.TURSO_AUTH_TOKEN as string,
        })
      : createClient({ url: `file:${process.cwd()}/prisma/dev.db` });

  const adapter = new PrismaLibSQL(libsql);
  global.db = new PrismaClient({ adapter });
}

export const db = global.db;
