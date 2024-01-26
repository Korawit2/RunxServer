-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race_result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Races_id" INTEGER NOT NULL,
    "runx_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "points_gained" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age_group" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "claim_status" BOOLEAN NOT NULL DEFAULT false,
    "time_stamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Race_result_Races_id_fkey" FOREIGN KEY ("Races_id") REFERENCES "Races" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_result_runx_id_fkey" FOREIGN KEY ("runx_id") REFERENCES "UserRunX" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Race_result" ("Races_id", "age_group", "claim_status", "firstname", "gender", "id", "lastname", "nationality", "points_gained", "rank", "runx_id", "time", "time_stamp") SELECT "Races_id", "age_group", "claim_status", "firstname", "gender", "id", "lastname", "nationality", "points_gained", "rank", "runx_id", "time", "time_stamp" FROM "Race_result";
DROP TABLE "Race_result";
ALTER TABLE "new_Race_result" RENAME TO "Race_result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
