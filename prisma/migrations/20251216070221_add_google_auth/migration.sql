/*
  Warnings:

  - The primary key for the `GoogleOAuthState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GoogleOAuthState` table. All the data in the column will be lost.
  - The primary key for the `GoogleTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GoogleTokens` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GoogleOAuthState" (
    "state" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GoogleOAuthState" ("createdAt", "shop", "state") SELECT "createdAt", "shop", "state" FROM "GoogleOAuthState";
DROP TABLE "GoogleOAuthState";
ALTER TABLE "new_GoogleOAuthState" RENAME TO "GoogleOAuthState";
CREATE TABLE "new_GoogleTokens" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GoogleTokens" ("accessToken", "expiresAt", "refreshToken", "shop", "updatedAt") SELECT "accessToken", "expiresAt", "refreshToken", "shop", "updatedAt" FROM "GoogleTokens";
DROP TABLE "GoogleTokens";
ALTER TABLE "new_GoogleTokens" RENAME TO "GoogleTokens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
