/*
  Warnings:

  - You are about to alter the column `policy` on the `UserRunX` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRunX" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname_eng" TEXT NOT NULL,
    "lastname_eng" TEXT NOT NULL,
    "firstname_thai" DATETIME,
    "lastname_thai" TEXT,
    "birth_date" TEXT,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_passport" TEXT,
    "nationality" TEXT,
    "policy" BOOLEAN NOT NULL
);
INSERT INTO "new_UserRunX" ("birth_date", "email", "firstname_eng", "firstname_thai", "gender", "id", "id_passport", "lastname_eng", "lastname_thai", "nationality", "password", "policy") SELECT "birth_date", "email", "firstname_eng", "firstname_thai", "gender", "id", "id_passport", "lastname_eng", "lastname_thai", "nationality", "password", "policy" FROM "UserRunX";
DROP TABLE "UserRunX";
ALTER TABLE "new_UserRunX" RENAME TO "UserRunX";
CREATE UNIQUE INDEX "UserRunX_email_key" ON "UserRunX"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
