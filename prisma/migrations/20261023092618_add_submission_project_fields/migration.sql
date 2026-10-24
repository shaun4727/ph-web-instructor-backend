/*
  Warnings:

  - Added the required column `description` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `live_link` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_name` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repo_url` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "live_link" VARCHAR(2048) NOT NULL,
ADD COLUMN     "project_name" VARCHAR(150) NOT NULL,
ADD COLUMN     "repo_url" VARCHAR(2048) NOT NULL;
