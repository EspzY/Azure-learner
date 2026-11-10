-- Additive access/evidence adapter. No World, model, request or receipt is rewritten.
BEGIN;
SET LOCAL ROLE laboratory_v3_owner;
SELECT pg_advisory_xact_lock(hashtextextended('laboratory_v3_schema_011',0));
ALTER TABLE laboratory_v3.workspaces ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'free';
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conrelid='laboratory_v3.workspaces'::regclass AND conname='workspace_purpose_allowed') THEN
  ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_purpose_allowed CHECK(purpose IN ('free','course-technical'));
  ALTER TABLE laboratory_v3.workspaces ADD CONSTRAINT workspace_id_purpose UNIQUE(id,purpose);
 END IF;
END $$;
CREATE OR REPLACE FUNCTION laboratory_v3.immutable_workspace_purpose() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.purpose IS DISTINCT FROM OLD.purpose THEN RAISE EXCEPTION 'Workspace purpose is immutable'; END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS immutable_workspace_purpose ON laboratory_v3.workspaces;
CREATE TRIGGER immutable_workspace_purpose BEFORE UPDATE OF purpose ON laboratory_v3.workspaces
 FOR EACH ROW EXECUTE FUNCTION laboratory_v3.immutable_workspace_purpose();
CREATE TABLE IF NOT EXISTS laboratory_v3.course_bindings (
 id uuid PRIMARY KEY,
 workspace_id uuid NOT NULL UNIQUE,
 purpose text NOT NULL CHECK(purpose='course-technical'),
 adapter text NOT NULL CHECK(adapter='course-workspace@1'),
 profile text NOT NULL CHECK(profile='az900-technical@1'),
 course text NOT NULL CHECK(course='az900'),
 model text NOT NULL CHECK(model='laboratory@3.9.0'),
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(workspace_id,purpose) REFERENCES laboratory_v3.workspaces(id,purpose),
 FOREIGN KEY(workspace_id,model) REFERENCES laboratory_v3.workspaces(id,model),
 UNIQUE(id,workspace_id,model)
);
CREATE TABLE IF NOT EXISTS laboratory_v3.course_evidence (
 id uuid PRIMARY KEY,
 binding_id uuid NOT NULL,
 workspace_id uuid NOT NULL,
 model text NOT NULL CHECK(model='laboratory@3.9.0'),
 adapter text NOT NULL CHECK(adapter='course-evidence@1'),
 through integer NOT NULL CHECK(through BETWEEN 0 AND 512),
 expected_revision integer NOT NULL CHECK(expected_revision>=0),
 revision integer NOT NULL CHECK(revision>=0),
 attempt integer NOT NULL CHECK(attempt>0),
 history_digest text NOT NULL CHECK(history_digest ~ '^[0-9a-f]{64}$'),
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(binding_id,workspace_id,model) REFERENCES laboratory_v3.course_bindings(id,workspace_id,model)
);
DROP TRIGGER IF EXISTS immutable_course_bindings ON laboratory_v3.course_bindings;
CREATE TRIGGER immutable_course_bindings BEFORE UPDATE OR DELETE OR TRUNCATE ON laboratory_v3.course_bindings
 FOR EACH STATEMENT EXECUTE FUNCTION laboratory_v3.append_only();
DROP TRIGGER IF EXISTS immutable_course_evidence ON laboratory_v3.course_evidence;
CREATE TRIGGER immutable_course_evidence BEFORE UPDATE OR DELETE OR TRUNCATE ON laboratory_v3.course_evidence
 FOR EACH STATEMENT EXECUTE FUNCTION laboratory_v3.append_only();
REVOKE ALL ON laboratory_v3.course_bindings,laboratory_v3.course_evidence FROM PUBLIC;
GRANT SELECT,INSERT ON laboratory_v3.course_bindings,laboratory_v3.course_evidence TO laboratory_v3_app;
COMMIT;
