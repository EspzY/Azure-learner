/** Test page only; actual frozen store and actual Portal request identity. */
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { requestFor } from '../../src/domain/portal/model';
import {
  prepareCandidate,
  activateCandidate,
  inspectCandidate,
  probeKey,
} from '../laboratory-activation-probe';

const root = document.querySelector('main')!;
let pauseBeforeWrite = false;
const port = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, raw: string) => {
    if (key === sandboxKey && pauseBeforeWrite) {
      pauseBeforeWrite = false;
      // Instrument ONLY scheduling immediately before the genuine write.
      // The frozen store has already executed its real compare-read.
      // eslint-disable-next-line no-debugger -- Test-only CDP scheduling barrier.
      debugger;
    }
    localStorage.setItem(key, raw);
  },
  removeItem: (key: string) => localStorage.removeItem(key),
};
const old = new SandboxStore(port);
old.load();
window.addEventListener('storage', (event) => {
  if (event.key === sandboxKey || event.key === null) old.changed();
});
function output(value: unknown) {
  root.querySelector('pre')!.textContent = JSON.stringify(value, null, 2);
}
root.querySelector<HTMLButtonElement>('[data-action="create"]')!.onclick = () => {
  const snapshot = old.getSnapshot();
  const request = requestFor(
    snapshot.attempt.engine,
    {
      type: 'CreateGroup',
      subscriptionId: 'sub-shared',
      name: root.querySelector<HTMLInputElement>('input')!.value,
      metadataRegion: 'norwayeast',
    },
    snapshot.attempt.events.length + 1,
  );
  const accepted = old.dispatch({ kind: 'command', request });
  output({ accepted, snapshot: old.getSnapshot(), raw: localStorage.getItem(sandboxKey) });
};
root.querySelector<HTMLButtonElement>('[data-action="pause"]')!.onclick = () => {
  pauseBeforeWrite = true;
  output({ armed: true });
};
root.querySelector<HTMLButtonElement>('[data-action="prepare"]')!.onclick = async () => {
  if (!navigator.locks) return output({ blocked: 'web-locks-unavailable' });
  const result = await navigator.locks.request('azurelab.laboratory.writer.v3', () => ({
    prepared: prepareCandidate(port, 'test-epoch', true),
    activated: activateCandidate(port, true),
    inspected: inspectCandidate(port),
  }));
  output(result);
};
root.querySelector<HTMLButtonElement>('[data-action="inspect"]')!.onclick = () =>
  output({ inspected: inspectCandidate(port), v3: localStorage.getItem(probeKey) });
output({ loaded: true, snapshot: old.getSnapshot() });
