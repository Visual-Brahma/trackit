/*
  Warnings:

  - Made the column `allowedRange` on table `InPersonEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InPersonEvent" ALTER COLUMN "allowedRange" SET NOT NULL,
ALTER COLUMN "allowedRange" SET DEFAULT 20;


CREATE OR REPLACE FUNCTION generate_unique_slug(table_name text, column_name text DEFAULT 'slug')
  RETURNS text
AS $$
DECLARE
  unique_slug text;
  slug_exists boolean;
  counter int := 0;
  query text;
BEGIN
  -- Generate a random 6-digit alphanumeric string
  unique_slug := substr(md5(random()::text), 1, 6);
  
  -- Ensure the slug only contains alphanumeric characters
  unique_slug := regexp_replace(unique_slug, '[^a-zA-Z0-9]+', '', 'g');
  
  -- Build dynamic query to check if the slug exists
  query := format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)', table_name, column_name, unique_slug);
  -- Check if the generated slug exists
  EXECUTE query INTO slug_exists;
  
  -- Loop until a unique slug is found
  WHILE slug_exists LOOP
    counter := counter + 1;
    unique_slug := unique_slug || counter::text;  -- Append counter as string
    query := format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)', table_name, column_name, unique_slug);
    EXECUTE query INTO slug_exists;
  END LOOP;
  
  RETURN unique_slug;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;


CREATE OR REPLACE FUNCTION generate_in_person_event_slug_trigger()
    RETURNS TRIGGER
    AS $$
BEGIN
    -- Generate a unique slug
    NEW.slug := generate_unique_slug('InPersonEvent');
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER generate_in_person_event_slug
    BEFORE INSERT ON "InPersonEvent"
    FOR EACH ROW
    EXECUTE PROCEDURE generate_in_person_event_slug_trigger();