-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "current_price" INTEGER NOT NULL DEFAULT 0,
    "bid_price" INTEGER NOT NULL DEFAULT 0,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" TEXT NOT NULL DEFAULT '1h3s',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER,
    CONSTRAINT "Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("bid_price", "current_price", "duration", "id", "itemId", "itemName", "published", "status") SELECT "bid_price", "current_price", "duration", "id", "itemId", "itemName", "published", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
