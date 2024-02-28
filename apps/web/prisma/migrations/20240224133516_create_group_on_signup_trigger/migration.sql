-- create a default group for each user that signs up.
CREATE OR REPLACE FUNCTION create_default_group_on_signup()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
DECLARE group_id text;
BEGIN
    INSERT INTO "Group" ("name", "description")
    VALUES ('My Group', 'This group contains all your attendance reports by default. Add more groups and members to organize your reports.')
    RETURNING id INTO group_id;

    INSERT INTO "GroupMember" ("groupId", "userId", "role")
    VALUES (group_id, NEW.id, 'OWNER');
    RETURN NEW;
END;
$$;

-- create trigger
CREATE OR REPLACE TRIGGER create_default_group_on_signup
    AFTER INSERT ON "User"
    FOR EACH ROW
    EXECUTE PROCEDURE create_default_group_on_signup();