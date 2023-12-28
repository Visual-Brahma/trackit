delimiter // 
CREATE TRIGGER prevent_group_deletion BEFORE DELETE ON ClassGroup 
FOR EACH ROW 
BEGIN 
DECLARE member_count INT;

SELECT
    COUNT(*) INTO member_count
FROM
    GroupMember
WHERE
    groupId = OLD.id;

IF member_count > 1 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Cannot delete group with active members, please remove all members first.';

END IF;

END;
// delimiter;

delimiter  //
CREATE TRIGGER prevent_user_deletion BEFORE DELETE ON user 
FOR EACH ROW 
BEGIN 
DECLARE owner_count INT;

-- Count the number of groups where the user is the only owner
SELECT
    COUNT(*) INTO owner_count
FROM
    (
        SELECT
            group_id
        from
            groupmember
        where
            role = 'OWNER'
            and group_id in (
                SELECT
                    group_id
                FROM
                    groupmember
                WHERE
                    user_id = OLD.id
                    AND role = 'OWNER'
            )
        GROUP BY
            group_id
        HAVING
            COUNT(*) > 1

) AS sole_owner_groups;

IF owner_count > 0 THEN -- If the user is the sole owner of any group, prevent deletion
SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Cannot delete the user. Transfer ownership or delete groups first.';

END IF;

END;

// delimiter ;

delimiter  //
CREATE TRIGGER generate_avatar_url BEFORE INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.avatarUrl IS NULL THEN
        SET NEW.avatarUrl = CONCAT('https://api.dicebear.com/7.x/adventurer/svg?seed=', NEW.name);
    END IF;
END;
// delimiter ;