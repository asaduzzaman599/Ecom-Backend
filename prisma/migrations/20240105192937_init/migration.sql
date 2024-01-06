-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SuperAdmin', 'Admin', 'Customer');

-- CreateEnum
CREATE TYPE "SettingValueType" AS ENUM ('NumberValue', 'BooleanValue', 'stringValue');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Customer';

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "internalName" TEXT NOT NULL,
    "stringValue" TEXT NOT NULL,
    "numberValue" INTEGER NOT NULL,
    "booleanValue" BOOLEAN NOT NULL DEFAULT false,
    "valueType" "SettingValueType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonSetting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "internalName" TEXT NOT NULL,
    "stringValue" TEXT NOT NULL,
    "numberValue" INTEGER NOT NULL,
    "booleanValue" BOOLEAN NOT NULL DEFAULT false,
    "valueType" "SettingValueType" NOT NULL,

    CONSTRAINT "CommonSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_title_key" ON "UserSetting"("title");

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_internalName_key" ON "UserSetting"("internalName");

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "UserSetting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommonSetting_title_key" ON "CommonSetting"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CommonSetting_internalName_key" ON "CommonSetting"("internalName");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
