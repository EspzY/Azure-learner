/** Presentation preflight only. No answer merge, migration or new authority. */
export function prepareExistingTeaching<S>(
  store: { getSnapshot(): { ready: boolean; issue: string | null; save: S }; changed(): void },
  key: string,
  read: (key: string) => string | null,
  restore: (raw: string | null) => { save: S; issue: string | null },
  facts: (save: S) => { active: boolean; assisted: boolean },
  aid: () => boolean,
) {
  const current = store.getSnapshot();
  if (!current.ready || current.issue) return false;
  try {
    const latest = restore(read(key));
    if (latest.issue || JSON.stringify(latest.save) !== JSON.stringify(current.save)) {
      store.changed();
      return false;
    }
    const state = facts(current.save);
    if (state.active && !state.assisted && !aid()) return false;
    const after = store.getSnapshot(),
      persisted = restore(read(key));
    // Existing stores can retain event=true only in memory on denied writes.
    if (
      after.issue ||
      persisted.issue ||
      JSON.stringify(after.save) !== JSON.stringify(persisted.save)
    )
      return false;
    return !facts(after.save).active || facts(after.save).assisted;
  } catch {
    store.changed();
    return false;
  }
}
