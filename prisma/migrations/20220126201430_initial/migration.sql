/*
  Warnings:

  - You are about to drop the column `plot` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `overview` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "plot",
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "posterPath" TEXT;
