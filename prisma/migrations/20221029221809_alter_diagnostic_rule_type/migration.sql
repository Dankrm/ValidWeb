/*
  Warnings:

  - You are about to alter the column `diagnostic` on the `RuleType` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RuleType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "diagnostic" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_RuleType" ("code", "diagnostic", "id", "type", "visible") SELECT "code", "diagnostic", "id", "type", "visible" FROM "RuleType";
DROP TABLE "RuleType";
ALTER TABLE "new_RuleType" RENAME TO "RuleType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
