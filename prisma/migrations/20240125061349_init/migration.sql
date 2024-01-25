-- CreateTable
CREATE TABLE "UserRunX" (
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
    "policy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cover_img" TEXT NOT NULL,
    "logo_img" TEXT NOT NULL,
    "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Races" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "org_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "cover_img" TEXT NOT NULL,
    "logo_img" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "max_point" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    CONSTRAINT "Races_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Races_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Race_result" (
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
    CONSTRAINT "Race_result_Races_id_fkey" FOREIGN KEY ("Races_id") REFERENCES "Races" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Race_result_runx_id_fkey" FOREIGN KEY ("runx_id") REFERENCES "UserRunX" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRunX_email_key" ON "UserRunX"("email");
