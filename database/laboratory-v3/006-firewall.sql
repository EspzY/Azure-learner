-- Additive allowlist extension, never a rewrite/upgrade of workspace or receipt JSON.
-- Supersedes constraint-only003/004/005; cold setup001/002/006 is supported.
BEGIN;
SET LOCAL ROLE laboratory_v3_owner;
SELECT pg_advisory_xact_lock(hashtextextended('laboratory_v3_schema_006',0));
ALTER TABLE laboratory_v3.workspaces DROP CONSTRAINT workspace_model_allowed;
ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0'));
ALTER TABLE laboratory_v3.events DROP CONSTRAINT event_model_allowed;
ALTER TABLE laboratory_v3.events ADD CONSTRAINT event_model_allowed
 CHECK(model IN ('laboratory@3.0.0','laboratory@3.1.0','laboratory@3.2.0','laboratory@3.3.0','laboratory@3.4.0','laboratory@3.5.0'));
COMMIT;
