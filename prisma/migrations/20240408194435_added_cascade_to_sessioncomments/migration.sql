-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SessionComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionComment_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SessionComment" ("body", "created_at", "id", "likes", "session_id", "user_id") SELECT "body", "created_at", "id", "likes", "session_id", "user_id" FROM "SessionComment";
DROP TABLE "SessionComment";
ALTER TABLE "new_SessionComment" RENAME TO "SessionComment";
CREATE INDEX "SessionComment_user_id_idx" ON "SessionComment"("user_id");
CREATE INDEX "SessionComment_session_id_idx" ON "SessionComment"("session_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
