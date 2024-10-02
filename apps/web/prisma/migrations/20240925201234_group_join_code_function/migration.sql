-- Trigger function to generate join code
CREATE OR REPLACE FUNCTION generate_group_join_code_trigger()
    RETURNS TRIGGER
    AS $$
BEGIN
    -- Generate a unique 6-digit join code
    NEW."joinCode" := generate_unique_slug('Group', 'joinCode');
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Trigger to generate join code on insert
CREATE OR REPLACE TRIGGER generate_group_join_code_on_insert
    BEFORE INSERT ON public."Group"
    FOR EACH ROW
    EXECUTE PROCEDURE generate_group_join_code_trigger();