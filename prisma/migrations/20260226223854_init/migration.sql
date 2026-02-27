-- CreateTable
CREATE TABLE "concert_memories" (
    "id" TEXT NOT NULL,
    "ticket_image_url" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "artist" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tour" TEXT,
    "support" TEXT,
    "song_missed" TEXT,
    "best_live_song" TEXT,
    "description" TEXT,
    "km_traveled" INTEGER,
    "entrance_rating" INTEGER,
    "support_act_rating" INTEGER,
    "main_act_rating" INTEGER,
    "crowd_rating" INTEGER,
    "stage_show_rating" INTEGER,
    "mood_rating" INTEGER,
    "overall_rating" INTEGER,
    "setlist_rating" INTEGER,
    "energy_after" INTEGER,
    "experience_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concert_memories_pkey" PRIMARY KEY ("id")
);
