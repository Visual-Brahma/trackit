CREATE OR REPLACE FUNCTION generate_unique_slug(table_name text, column_name text DEFAULT 'slug')
  RETURNS text
AS $$
DECLARE
  base_slug text;
  unique_slug text;
  slug_count int;
  query text;
BEGIN
  -- Generate a random 6-character alphanumeric string
  base_slug := substr(regexp_replace(encode(gen_random_bytes(4), 'hex'), '[^a-zA-Z0-9]+', '', 'g'), 1, 6);
  
  -- Count existing slugs with the same base
  -- Count existing slugs with the same base or numeric suffix
  query := format(
    'SELECT COUNT(*) FROM %I WHERE %I = %L OR (%I ~ %L AND %I !~ %L)',
    table_name, 
    column_name, base_slug,
    column_name, '^' || base_slug || '[0-9]+$',
    column_name, '^' || base_slug || '0+[1-9][0-9]*$'
  );
  EXECUTE query INTO slug_count;
  
  -- If no conflicts, return the base slug
  IF slug_count = 0 THEN
    RETURN base_slug;
  END IF;
  
  -- If conflicts exist, append the next available number
  unique_slug := base_slug || (slug_count + 1)::text;
  
  RETURN unique_slug;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- create a default group for each user that signs up.
CREATE OR REPLACE FUNCTION create_default_group_on_signup()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
DECLARE group_id text;
BEGIN
    IF NEW.name IS NULL THEN
    INSERT INTO "Group" ("name", "description")
    VALUES ('My Group', 'This group contains all your attendance reports by default. Add more groups and members to organize your reports.')
    RETURNING id INTO group_id;
    ELSE
    INSERT INTO "Group" ("name", "description")
    VALUES (CONCAT(NEW.name, '''s Group'), 'This group contains all your attendance reports by default. Add more groups and members to organize your reports.')
    RETURNING id INTO group_id;

    END IF;

    INSERT INTO "GroupMember" ("groupId", "userId", "role", "isDefault")
    VALUES (group_id, NEW.id, 'OWNER', true);
    RETURN NEW;
END;
$$;