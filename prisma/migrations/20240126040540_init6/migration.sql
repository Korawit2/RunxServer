/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Events_name_key" ON "Events"("name");
