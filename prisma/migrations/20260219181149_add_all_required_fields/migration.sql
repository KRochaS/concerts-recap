/*
  Warnings:

  - Made the column `date` on table `concert_memories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `venue` on table `concert_memories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `concert_memories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "concert_memories" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "venue" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL;
