
-- Create the user_emotions table
CREATE TABLE IF NOT EXISTS "public"."user_emotions" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "date" timestamp with time zone NOT NULL DEFAULT now(),
    "confidence" integer NOT NULL,
    "motivation" integer NOT NULL,
    "stress" integer NOT NULL,
    "satisfaction" integer NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Add Foreign Key Constraint
ALTER TABLE "public"."user_emotions" ADD CONSTRAINT "user_emotions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- Add Row Level Security (RLS)
ALTER TABLE "public"."user_emotions" ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to select only their own emotion data
CREATE POLICY "Users can view their own emotion data"
ON "public"."user_emotions"
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own emotion data
CREATE POLICY "Users can insert their own emotion data"
ON "public"."user_emotions"
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own emotion data
CREATE POLICY "Users can update their own emotion data"
ON "public"."user_emotions"
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own emotion data
CREATE POLICY "Users can delete their own emotion data"
ON "public"."user_emotions"
FOR DELETE
USING (auth.uid() = user_id);
