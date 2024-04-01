-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TopUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "backing_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "backingId" INTEGER,
    CONSTRAINT "TopUp_backingId_fkey" FOREIGN KEY ("backingId") REFERENCES "Backing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TopUp" ("amount", "backing_id", "created_at", "id", "note", "user_id") SELECT "amount", "backing_id", "created_at", "id", "note", "user_id" FROM "TopUp";
DROP TABLE "TopUp";
ALTER TABLE "new_TopUp" RENAME TO "TopUp";
CREATE TABLE "new_Chop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "backing_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chop_split" TEXT NOT NULL,
    "note" TEXT,
    "backingId" INTEGER,
    CONSTRAINT "Chop_backingId_fkey" FOREIGN KEY ("backingId") REFERENCES "Backing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chop" ("amount", "backing_id", "chop_split", "created_at", "id", "note", "user_id") SELECT "amount", "backing_id", "chop_split", "created_at", "id", "note", "user_id" FROM "Chop";
DROP TABLE "Chop";
ALTER TABLE "new_Chop" RENAME TO "Chop";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
