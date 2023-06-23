/*
  Warnings:

  - You are about to drop the column `duration` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "current_price" INTEGER NOT NULL DEFAULT 0,
    "bid_price" INTEGER NOT NULL DEFAULT 0,
    "start_duration" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "end_duration" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("id", "itemId", "itemName", "published", "status") SELECT "id", "itemId", "itemName", "published", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
