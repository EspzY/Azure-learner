import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const frozenBase = 'a667b26276cc7a1bbed9aa9203cf431eb9001ada';
/** No runtime route or dependency: Playwright serves this test-only bundle. */
export function laboratoryProbeBundle() {
  const modules = new Map<string, string>();
  const hashes: Record<string, string> = {};
  function visit(id: string) {
    if (modules.has(id)) return;
    const source = readFileSync(id, 'utf8');
    if (id.startsWith('src/')) {
      const original = execFileSync('git', ['show', `${frozenBase}:${id}`], {
        maxBuffer: 8 * 1024 * 1024,
      }).toString();
      if (source !== original) throw Error('Old client source changed: ' + id);
      hashes[id] = createHash('sha256').update(source).digest('hex');
    }
    const result = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText;
    modules.set(id, result);
    for (const match of result.matchAll(/require\("([^"\n]+)"\)/g)) {
      if (!match[1]!.startsWith('.')) throw Error('Unexpected external module: ' + match[1]);
      visit(path.posix.normalize(path.posix.join(path.posix.dirname(id), match[1]!)) + '.ts');
    }
  }
  const entry = 'tests/fixtures/laboratory-v2-client.ts';
  visit(entry);
  const definitions = [...modules]
    .map(([id, code]) => `${JSON.stringify(id)}:function(require,module,exports){\n${code}\n}`)
    .join(',\n');
  const js = `(function(){const definitions={${definitions}},cache={};
function load(id){if(cache[id])return cache[id].exports;const module={exports:{}};cache[id]=module;
definitions[id](function(relative){const parts=id.split('/');parts.pop();for(const p of relative.split('/')){if(p==='..')parts.pop();else if(p!=='.')parts.push(p);}return load(parts.join('/')+'.ts');},module,module.exports);return module.exports;}
load(${JSON.stringify(entry)});})();`;
  return { js, hashes };
}
export const probeHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PR59 activation counterexample — test only</title></head><body>
<main><h1>Activation counterexample · test only</h1>
<p>No production activation, v3 World or Storage service is implemented.</p>
<label>Resource Group name <input value="rg-alpha"></label>
<button data-action="pause">Pause next legacy write</button>
<button data-action="create">Create using frozen PR58 store</button>
<button data-action="prepare">Prepare and test candidate activation</button>
<button data-action="inspect">Inspect candidate checkpoint</button>
<pre aria-label="Probe result"></pre></main><script src="/__qa/laboratory-probe.js"></script></body></html>`;
