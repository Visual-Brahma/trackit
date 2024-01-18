-- prevent group deletion if it has active members other than the owner
CREATE OR REPLACE FUNCTION prevent_non_empty_group_deletion()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
DECLARE member_count integer;
BEGIN
    SELECT
        COUNT(id) INTO member_count
    FROM
        "GroupMember"
    WHERE
        "groupId" = OLD.id;

    IF member_count > 1 THEN
        RAISE EXCEPTION 'Cannot delete group with active members, please remove all members first.';
    END IF;
    RETURN NEW;
END;
$$;

-- create trigger
CREATE TRIGGER prevent_non_empty_group_deletion
    BEFORE DELETE ON "Group"
    FOR EACH ROW
    EXECUTE PROCEDURE prevent_non_empty_group_deletion();

-- prevent user deletion if they are the only owner of any group
CREATE OR REPLACE FUNCTION prevent_user_deletion()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
DECLARE owner_count INTEGER;
BEGIN
    -- Count the number of groups where the user is the only owner
    SELECT COUNT(*) INTO owner_count
    FROM (
        SELECT "groupId"
        from "GroupMember"
        where role = 'OWNER'
            and "groupId" in (
                SELECT "groupId"
                FROM "GroupMember"
                WHERE "userId" = OLD.id
                    AND role = 'OWNER'
            )
        GROUP BY "groupId"
        HAVING COUNT(*) > 1
        ) AS sole_owner_groups;
    
    IF owner_count > 0 THEN -- If the user is the sole owner of any group, prevent deletion
    RAISE EXCEPTION 'Cannot delete the user. Transfer ownership or delete groups first.';
    END IF;
    RETURN NEW;
END;
$$;

-- create trigger
CREATE TRIGGER prevent_user_deletion
    BEFORE DELETE ON "User"
    FOR EACH ROW
    EXECUTE PROCEDURE prevent_user_deletion();


CREATE OR REPLACE FUNCTION url_encode(input_text text)
    RETURNS text
    LANGUAGE plpgsql
AS $$
DECLARE
    result_text text;
BEGIN
    -- Use REPLACE to replace spaces with "%20" in the input_text
    result_text := REPLACE(input_text, ' ', '%20');

    RETURN result_text;
END;
$$;


-- generate avatar url if not provided
CREATE OR REPLACE FUNCTION generate_avatar_url()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.image IS NULL THEN
        NEW.image := CONCAT('https://api.dicebear.com/7.x/adventurer/svg?seed=', url_encode(NEW.name));
    END IF;
    RETURN NEW;
END;
$$;

-- create trigger
CREATE TRIGGER generate_avatar_url
    BEFORE INSERT ON "User"
    FOR EACH ROW
    EXECUTE PROCEDURE generate_avatar_url();
