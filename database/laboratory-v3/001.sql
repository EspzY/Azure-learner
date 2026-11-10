-- Applied explicitly by the isolated database owner, never during a request/build.
CREATE SCHEMA IF NOT EXISTS laboratory_v3 AUTHORIZATION laboratory_v3_owner;
SET ROLE laboratory_v3_owner;
CREATE TABLE IF NOT EXISTS laboratory_v3.workspaces (
 id uuid PRIMARY KEY,
 token_hash text NOT NULL UNIQUE CHECK (length(token_hash)=64),
 expires_at timestamptz NOT NULL,
 world jsonb NOT NULL,
 sequence integer NOT NULL DEFAULT 0 CHECK (sequence BETWEEN 0 AND 512),
 window_start timestamptz NOT NULL DEFAULT now(),
 request_count integer NOT NULL DEFAULT 0 CHECK (request_count>=0)
);
CREATE TABLE IF NOT EXISTS laboratory_v3.events (
 workspace_id uuid NOT NULL REFERENCES laboratory_v3.workspaces(id),
 sequence integer NOT NULL CHECK(sequence>0 AND sequence<=512),
 command_id text NOT NULL,
 model text NOT NULL CHECK(model='laboratory@3.0.0'),
 attempt integer NOT NULL CHECK(attempt>0),
 request jsonb NOT NULL,
 receipt jsonb NOT NULL,
 PRIMARY KEY(workspace_id,command_id),
 UNIQUE(workspace_id,sequence)
);
CREATE TABLE IF NOT EXISTS laboratory_v3.admission (
 id integer PRIMARY KEY CHECK(id=1),
 window_start timestamptz NOT NULL,
 count integer NOT NULL CHECK(count>=0)
);
INSERT INTO laboratory_v3.admission VALUES(1,now(),0) ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION laboratory_v3.append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Laboratory technical events are append-only'; END;
$$;
DROP TRIGGER IF EXISTS immutable_events ON laboratory_v3.events;
CREATE TRIGGER immutable_events BEFORE UPDATE OR DELETE OR TRUNCATE ON laboratory_v3.events
 FOR EACH STATEMENT EXECUTE FUNCTION laboratory_v3.append_only();
RESET ROLE;
REVOKE ALL ON SCHEMA laboratory_v3 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA laboratory_v3 FROM PUBLIC;
GRANT USAGE ON SCHEMA laboratory_v3 TO laboratory_v3_app;
GRANT SELECT,INSERT,UPDATE ON laboratory_v3.workspaces,laboratory_v3.admission TO laboratory_v3_app;
GRANT SELECT,INSERT ON laboratory_v3.events TO laboratory_v3_app;
