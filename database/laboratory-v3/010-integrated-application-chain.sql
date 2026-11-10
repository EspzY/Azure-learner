-- Additive explicit3.9 admission; no existing World, request or receipt rewrite.
-- Cold/repeated current setup is001 ->002 ->010. Existing003..009 adds010.
-- Never reapply narrower003..009 constraints once a3.9 workspace exists.
BEGIN;
SET LOCAL ROLE laboratory_v3_owner;
SELECT pg_advisory_xact_lock(hashtextextended('laboratory_v3_schema_010',0));
ALTER TABLE laboratory_v3.workspaces DROP CONSTRAINT IF EXISTS workspace_model_allowed;
ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0','laboratory@3.6.0','laboratory@3.7.0','laboratory@3.8.0','laboratory@3.9.0'));
ALTER TABLE laboratory_v3.events DROP CONSTRAINT IF EXISTS event_model_allowed;
ALTER TABLE laboratory_v3.events ADD CONSTRAINT event_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0','laboratory@3.6.0','laboratory@3.7.0','laboratory@3.8.0','laboratory@3.9.0'));
COMMIT;
