-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race_result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Races_id" INTEGER NOT NULL,
    "runx_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "points_gained" INTEGER NOT NULL,
    "time" DATETIME NOT NULL,
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
INSERT INTO "new_Race_result" ("Races_id", "age_group", "firstname", "gender", "id", "lastname", "nationality", "points_gained", "rank", "runx_id", "time") SELECT "Races_id", "age_group", "firstname", "gender", "id", "lastname", "nationality", "points_gained", "rank", "runx_id", "time" FROM "Race_result";
DROP TABLE "Race_result";
ALTER TABLE "new_Race_result" RENAME TO "Race_result";
CREATE TABLE "new_Races" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "org_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "cover_img" TEXT,
    "logo_img" TEXT,
    "start_time" TEXT NOT NULL,
    "max_point" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "time_stamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Races_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Races_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Races" ("cover_img", "date", "distance", "event_id", "id", "logo_img", "max_point", "name", "org_id", "start_time") SELECT "cover_img", "date", "distance", "event_id", "id", "logo_img", "max_point", "name", "org_id", "start_time" FROM "Races";
DROP TABLE "Races";
ALTER TABLE "new_Races" RENAME TO "Races";
CREATE UNIQUE INDEX "Races_name_key" ON "Races"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
