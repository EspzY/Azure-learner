import { it, expect } from 'vitest';
import { assertPR57Presentation, pr57PresentationChanges } from '../../../tests/pr57-preservation';
import { readHistorical as readFileSync } from '../../../tests/pr60-preservation';
import { createHash } from 'node:crypto';
import proof from '../../../docs/reviews/evidence/cc02/preservation.json';
const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
it('preserves all original technical and assessment contracts, source data and full locale prefix', () => {
  for (const [path, sha] of Object.entries(proof.wholeFiles)) {
    if (pr57PresentationChanges.includes(path)) {
      assertPR57Presentation(path, sha);
      continue;
    }
    expect(hash(readFileSync(path)), path).toBe(sha);
  }
  expect(hash(readFileSync('src/content/nb.ts').subarray(0, proof.localePrefix.bytes))).toBe(
    proof.localePrefix.sha256,
  );
});
it('only extracts identical authoritative VM requirements, preserving every other mission evaluator/event/rubric byte', () => {
  let text = readFileSync('src/domain/sandbox/missions.ts', 'utf8');
  text = text.replace(
    /\/\*\* Frozen guest-control@1 requirements,[\s\S]*?\n}\n(?=export function missionEvaluation)/,
    '',
  );
  text = text
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
  expect(hash(text)).toBe(proof.missionsSource.sha256);
  const test = readFileSync('tests/e2e/practical-missions.spec.ts', 'utf8').replace(
    "  await page.locator('.vm-debrief-alternatives > summary').click();\n",
    '',
  );
  expect(hash(test)).toBe(proof.oldMissionBrowser.sha256);
});
it('pins the four bounded legacy preservation-test amendments and their original assertions', async () => {
  const { execFileSync } = await import('node:child_process');
  const { format } = await import('prettier');
  for (const [path, entry] of Object.entries(proof.authorizedTests)) {
    const before = execFileSync('git', ['show', `${proof.base}:${path}`], { encoding: 'utf8' });
    expect(hash(before)).toBe(entry.before);
    let after = readFileSync(path, 'utf8');
    expect(hash(after)).toBe(entry.after);
    after = after
      .replace(
        /import\s+\{[^}]*\}\s+from '(?:\.\.\/\.\.\/\.\.\/tests\/|\.\/)cc02-preservation';\n/,
        '',
      )
      .replace(/\s*&&\s*!cc02DomainChanges.includes\(path\)/, '')
      .replace(/\s*for \(const path of cc02DomainChanges\) assertCC02Change\(path\);/, '')
      .replace(
        /\s*if \(path === 'src\/domain\/sandbox\/missions.ts'\) \{\s*assertCC02Change\(path, expected\);\s*continue;\s*\}/,
        '',
      );
    after = after.replace(
      /\s*if \(cc02PresentationChanges.includes\(path\)\) \{\s*assertCC02Change\(path, expected\);\s*continue;\s*\}/,
      '',
    );
    if (path === 'tests/cc03-preservation.ts')
      after = after.replace(
        /if \(cc02TestAuthorized\(path\)\) \{\s*assertCC02TestChange\(path, entry.after\);\s*\} else (expect\(hash\(readFileSync\(path\)\), path\).toBe\(entry.after\);)/,
        '$1',
      );
    if (path.includes('challenge-validity-preservation'))
      after = after.replace(
        /for \(const \[path, expected\] of Object.entries\(proof.wholeFiles\)\) \{\s*(expect\(hash\(readFileSync\(path\)\), path\).toBe\(expected\);)\s*\}/,
        'for (const [path, expected] of Object.entries(proof.wholeFiles)) $1',
      );
    expect(await format(after, { parser: 'typescript', singleQuote: true, printWidth: 92 })).toBe(
      await format(before, { parser: 'typescript', singleQuote: true, printWidth: 92 }),
    );
  }
});
