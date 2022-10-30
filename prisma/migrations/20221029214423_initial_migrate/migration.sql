-- CreateTable
CREATE TABLE "ChainingType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chain" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "messageCode" TEXT NOT NULL,
    "invalidation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RuleType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "diagnostic" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ruleTypeId" INTEGER NOT NULL,
    "chainingTypeId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "basedElement" TEXT NOT NULL,
    "validationElement" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Rule_ruleTypeId_fkey" FOREIGN KEY ("ruleTypeId") REFERENCES "RuleType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rule_chainingTypeId_fkey" FOREIGN KEY ("chainingTypeId") REFERENCES "ChainingType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Rule_chainingTypeId_basedElement_validationElement_key" ON "Rule"("chainingTypeId", "basedElement", "validationElement");
