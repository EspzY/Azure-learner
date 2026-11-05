import { expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import proof from '../docs/reviews/evidence/cc02/preservation.json';
const hash = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
export const cc02DomainChanges = [
  'src/domain/sandbox/missions.ts',
  'src/domain/sandbox/vm-debrief.ts',
  'src/domain/sandbox/vm-debrief.test.ts',
];
export const cc02PresentationChanges = [
  'src/features/course/mission-portal.tsx',
  'src/features/course/missions.css',
  'src/features/course/missions.tsx',
  'tests/e2e/practical-missions.spec.ts',
];
/** Exact reverse of the authorized extraction, not an exclusion of evaluator assertions. */
export function originalMissionSource() {
  return readFileSync('src/domain/sandbox/missions.ts', 'utf8')
    .replace(
      /\/\*\* Frozen guest-control@1 requirements,[\s\S]*?\n}\n(?=export function missionEvaluation)/,
      '',
    )
    .replace(
      'const required = infrastructureRequirements(s.mode);',
      "const independent = s.mode === 'independent';",
    )
    .replace(
      'chain.vm.image === required.image',
      "chain.vm.image === (independent ? 'windows-2022' : 'ubuntu-22-04')",
    )
    .replace(
      'chain.vm.profile === required.profile',
      "chain.vm.profile === (independent ? 'small' : 'standard')",
    )
    .replace('chain.data.gib === required.dataDiskGiB', 'chain.data.gib === 32')
    .replace('required.subscriptionId;', "(independent ? 'sub-app' : 'sub-shared');");
}
export function assertCC02Change(path: string, historicalHash?: string) {
  expect(proof.base).toBe('fb229a977ef6fb0250ededbb0d35d5314951a31a');
  expect([...cc02DomainChanges, ...cc02PresentationChanges]).toContain(path);
  const entry =
    (proof.authorizedDomain as Record<string, string>)[path] ??
    (proof.authorizedPresentation as Record<string, { after: string }>)[path]?.after;
  expect(entry, path).toBeDefined();
  expect(hash(readFileSync(path)), path).toBe(entry);
  if (cc02PresentationChanges.includes(path)) {
    const presentation = (
      proof.authorizedPresentation as Record<string, { before: string; after: string }>
    )[path];
    if (!presentation) throw Error('Missing CC02 presentation authorization: ' + path);
    const before = execFileSync('git', ['show', `${proof.base}:${path}`]);
    expect(hash(before)).toBe(presentation.before);
    if (historicalHash) expect(presentation.before).toBe(historicalHash);
    if (path.endsWith('.css'))
      expect(readFileSync(path).subarray(0, before.length).equals(before)).toBe(true);
    if (path === 'tests/e2e/practical-missions.spec.ts')
      expect(
        hash(
          readFileSync(path, 'utf8').replace(
            "  await page.locator('.vm-debrief-alternatives > summary').click();\n",
            '',
          ),
        ),
      ).toBe(presentation.before);
  }
  if (path === 'src/domain/sandbox/missions.ts') {
    expect(hash(originalMissionSource())).toBe(proof.missionsSource.sha256);
    if (historicalHash) expect(proof.missionsSource.sha256).toBe(historicalHash);
  }
}

export const cc02TestAuthorized = (path: string) => Object.hasOwn(proof.authorizedTests, path);
export function assertCC02TestChange(path: string, historicalHash: string) {
  const entry = (proof.authorizedTests as Record<string, { before: string; after: string }>)[path];
  expect(entry, path).toBeDefined();
  if (!entry) throw Error('Missing CC02 test authorization: ' + path);
  expect(hash(execFileSync('git', ['show', `${proof.base}:${path}`]))).toBe(historicalHash);
  expect(entry.before).toBe(historicalHash);
  expect(hash(readFileSync(path))).toBe(entry.after);
}
