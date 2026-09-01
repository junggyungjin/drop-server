-- This is an empty migration.
CREATE INDEX "drops_location_gist_idx" ON "drops" USING GIST ((ST_MakePoint(longitude, latitude)::geography));