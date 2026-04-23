import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

if (!global.db) {
  const adapter =
    process.env.NODE_ENV === "production"
      ? new PrismaLibSQL({
          url: (process.env.TURSO_DATABASE_URL as string).replace(
            "libsql://",
            "https://"
          ),
          authToken: process.env.TURSO_AUTH_TOKEN as string,
        })
      : new PrismaLibSQL({ url: `file:${process.cwd()}/prisma/dev.db` });

  global.db = new PrismaClient({ adapter });
}

export const db = global.db;
