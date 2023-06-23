-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "balanceId" INTEGER NOT NULL,
    CONSTRAINT "Balance_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "current_price" INTEGER NOT NULL DEFAULT 0,
    "bid_price" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '1h3s',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER,
    CONSTRAINT "Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
