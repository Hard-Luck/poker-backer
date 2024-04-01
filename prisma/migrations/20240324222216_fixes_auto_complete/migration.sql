/*
  Warnings:

  - You are about to drop the column `backingId` on the `Chop` table. All the data in the column will be lost.
  - You are about to drop the column `backingId` on the `TopUp` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "backing_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chop_split" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "Chop_backing_id_fkey" FOREIGN KEY ("backing_id") REFERENCES "Backing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chop" ("amount", "backing_id", "chop_split", "created_at", "id", "note", "user_id") SELECT "amount", "backing_id", "chop_split", "created_at", "id", "note", "user_id" FROM "Chop";
DROP TABLE "Chop";
ALTER TABLE "new_Chop" RENAME TO "Chop";
CREATE TABLE "new_TopUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "backing_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "TopUp_backing_id_fkey" FOREIGN KEY ("backing_id") REFERENCES "Backing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TopUp" ("amount", "backing_id", "created_at", "id", "note", "user_id") SELECT "amount", "backing_id", "created_at", "id", "note", "user_id" FROM "TopUp";
DROP TABLE "TopUp";
ALTER TABLE "new_TopUp" RENAME TO "TopUp";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
