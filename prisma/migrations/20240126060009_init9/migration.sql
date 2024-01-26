-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Races_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Races_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Races" ("cover_img", "date", "distance", "event_id", "id", "logo_img", "max_point", "name", "org_id", "start_time") SELECT "cover_img", "date", "distance", "event_id", "id", "logo_img", "max_point", "name", "org_id", "start_time" FROM "Races";
DROP TABLE "Races";
ALTER TABLE "new_Races" RENAME TO "Races";
CREATE UNIQUE INDEX "Races_name_key" ON "Races"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
