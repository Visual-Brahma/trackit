-- Since now each user got a default group on signup.
-- We need to move the isDefault column from the Group table to the GroupMember table so that we can have a default group for each user.
-- As joining a group feature was not implemented yet, we can assume that each group has ony one member and that member is the owner of the group.
UPDATE "GroupMember"
SET "isDefault" = true;