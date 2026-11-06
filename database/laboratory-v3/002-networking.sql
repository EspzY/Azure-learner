-- Explicit operator migration. No snapshot/event/request/receipt payload is rewritten.
BEGIN;
SET LOCAL ROLE laboratory_v3_owner;
SELECT pg_advisory_xact_lock(hashtextextended('laboratory_v3_schema_002',0));
ALTER TABLE laboratory_v3.workspaces ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT 'laboratory@3.0.0';
DO $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='laboratory_v3.workspaces'::regclass AND conname='workspace_model_allowed') THEN
  ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_model_allowed CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0'));
  ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_model_matches_world CHECK((world->>'model') IS NOT DISTINCT FROM model);
  ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_id_model UNIQUE(id,model);
 END IF;
END $$;
ALTER TABLE laboratory_v3.events DROP CONSTRAINT IF EXISTS events_model_check;
DO $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='laboratory_v3.events'::regclass AND conname='event_model_allowed') THEN
  ALTER TABLE laboratory_v3.events ADD CONSTRAINT event_model_allowed CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0'));
  ALTER TABLE laboratory_v3.events ADD CONSTRAINT event_workspace_model FOREIGN KEY(workspace_id,model) REFERENCES laboratory_v3.workspaces(id,model);
 END IF;
END $$;
CREATE OR REPLACE FUNCTION laboratory_v3.immutable_workspace_model() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.model IS DISTINCT FROM OLD.model THEN RAISE EXCEPTION 'Workspace model is immutable'; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS immutable_workspace_model ON laboratory_v3.workspaces;
CREATE TRIGGER immutable_workspace_model BEFORE UPDATE OF model ON laboratory_v3.workspaces FOR EACH ROW EXECUTE FUNCTION laboratory_v3.immutable_workspace_model();
COMMIT;
