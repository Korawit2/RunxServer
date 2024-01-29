-- CreateTable
CREATE TABLE "UserRunX" (
    "id" SERIAL NOT NULL,
    "firstname_eng" TEXT NOT NULL,
    "lastname_eng" TEXT NOT NULL,
    "firstname_thai" TEXT,
    "lastname_thai" TEXT,
    "birth_date" TIMESTAMP(3),
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_passport" TEXT,
    "nationality" TEXT,
    "policy" BOOLEAN NOT NULL,
    "user_img" TEXT,

    CONSTRAINT "UserRunX_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cover_img" TEXT,
    "logo_img" TEXT,
    "location" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Races" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cover_img" TEXT,
    "logo_img" TEXT,
    "start_time" TEXT NOT NULL,
    "max_point" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Races_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race_result" (
    "id" SERIAL NOT NULL,
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
    "time_stamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Race_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRunX_email_key" ON "UserRunX"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Events_name_key" ON "Events"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Races_name_key" ON "Races"("name");

-- AddForeignKey
ALTER TABLE "Races" ADD CONSTRAINT "Races_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Races" ADD CONSTRAINT "Races_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race_result" ADD CONSTRAINT "Race_result_Races_id_fkey" FOREIGN KEY ("Races_id") REFERENCES "Races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race_result" ADD CONSTRAINT "Race_result_runx_id_fkey" FOREIGN KEY ("runx_id") REFERENCES "UserRunX"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
