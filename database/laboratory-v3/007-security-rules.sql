-- Additive model allowlist; no workspace, snapshot, request or receipt rewrite.
-- Cold setup001/002/007 supersedes constraint-only003/004/005/006.
BEGIN;
SET LOCAL ROLE laboratory_v3_owner;
SELECT pg_advisory_xact_lock(hashtextextended('laboratory_v3_schema_007',0));
ALTER TABLE laboratory_v3.workspaces DROP CONSTRAINT workspace_model_allowed;
ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0','laboratory@3.6.0'));
ALTER TABLE laboratory_v3.events DROP CONSTRAINT event_model_allowed;
ALTER TABLE laboratory_v3.events ADD CONSTRAINT event_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0','laboratory@3.6.0'));
COMMIT;
