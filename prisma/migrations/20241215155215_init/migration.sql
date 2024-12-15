-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "conversation" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "profilePicture" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userstatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "userstatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_user1Id_index_uniq" ON "conversation"("user1Id");

-- CreateIndex
CREATE INDEX "Conversation_user2Id_index_uniq" ON "conversation"("user2Id");

-- CreateIndex
CREATE INDEX "Invite_receiverId_index_uniq" ON "invite"("receiverId");

-- CreateIndex
CREATE INDEX "Invite_senderId_index_uniq" ON "invite"("senderId");

-- CreateIndex
CREATE INDEX "Message_conversationId_index_uniq" ON "message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_index_uniq" ON "message"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserStatus_userId_key" ON "userstatus"("userId");

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "Conversation_user1Id_fkey_uniq" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "Conversation_user2Id_fkey_uniq" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "Invite_receiverId_fkey_uniq" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "Invite_senderId_fkey_uniq" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "Message_conversationId_fkey_uniq" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "Message_senderId_fkey_uniq" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userstatus" ADD CONSTRAINT "UserStatus_userId_fkey_uniq" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
