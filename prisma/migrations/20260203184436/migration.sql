-- CreateTable
CREATE TABLE "concert_memories" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "artist" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concert_memories_pkey" PRIMARY KEY ("id")
);
