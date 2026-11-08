import pg from 'pg';
import { readFileSync, existsSync } from 'node:fs';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const admin = process.env.LAB_ADMIN_DATABASE_URL,
  runtime = process.env.LAB_DATABASE_URL;
if (!admin || !runtime)
  throw Error('Explicit dedicated LAB_ADMIN_DATABASE_URL and LAB_DATABASE_URL required');
const a = new URL(admin),
  r = new URL(runtime);
if (
  !['127.0.0.1', 'localhost', '[::1]'].includes(a.hostname) ||
  a.hostname !== r.hostname ||
  a.port !== r.port ||
  !/^\/azurelab_lab_[a-z0-9_]+$/.test(a.pathname) ||
  r.pathname !== a.pathname ||
  r.username !== 'laboratory_v3_app'
)
  throw Error('Setup is restricted to a dedicated local Laboratory database and role');
const owner = new pg.Client({ connectionString: admin });
await owner.connect();
try {
  for (const role of ['laboratory_v3_owner', 'laboratory_v3_app']) {
    const found = await owner.query('SELECT 1 FROM pg_roles WHERE rolname=$1', [role]);
    if (!found.rowCount) await owner.query(`CREATE ROLE ${role} NOLOGIN`);
  }
  const password = decodeURIComponent(r.password);
  if (password.length < 16) throw Error('Dedicated runtime password must be at least16 characters');
  await owner.query(
    "ALTER ROLE laboratory_v3_app LOGIN PASSWORD '" + password.replaceAll("'", "''") + "'",
  );
  const targets = [admin];
  if (process.env.LAB_TEST_ADMIN_DATABASE_URL) {
    const test = new URL(process.env.LAB_TEST_ADMIN_DATABASE_URL);
    if (
      test.hostname !== a.hostname ||
      test.port !== a.port ||
      !/^\/azurelab_lab_test_[a-z0-9_]+$/.test(test.pathname)
    )
      throw Error('Test database must be isolated and local');
    const name = test.pathname.slice(1);
    if (!(await owner.query('SELECT 1 FROM pg_database WHERE datname=$1', [name])).rowCount)
      await owner.query(`CREATE DATABASE "${name}"`);
    targets.push(test.href);
  }
  for (const target of targets) {
    const client = new pg.Client({ connectionString: target });
    await client.connect();
    try {
      //008 supersedes constraint-only003–007. Never reapply a narrower allowlist to newer data.
      for (const migration of ['001.sql', '002-networking.sql', '008-topology-remediation.sql'])
        await client.query(readFileSync('database/laboratory-v3/' + migration, 'utf8'));
      const db = new URL(target).pathname.slice(1);
      await client.query(`REVOKE ALL ON DATABASE "${db}" FROM PUBLIC`);
      await client.query(`GRANT CONNECT ON DATABASE "${db}" TO laboratory_v3_app`);
    } finally {
      await client.end();
    }
  }
  console.log(
    'Dedicated local Laboratory schemas/roles initialized. No application resources created.',
  );
} finally {
  await owner.end();
}
