import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const root = fileURLToPath(new URL('..', import.meta.url));
export const auditPath = 'docs/audits/az900-2026-07-20.json';
const matrixPath = 'docs/AZ900_COVERAGE_MATRIX.md';
const counts = {
  1.1: 7,
  1.2: 4,
  1.3: 4,
  2.1: 7,
  2.2: 6,
  2.3: 6,
  2.4: 8,
  3.1: 4,
  3.2: 3,
  3.3: 5,
  3.4: 3,
};
const states = ['COMPLETE', 'PARTIAL', 'MISSING', 'UNVERIFIED'];
export function validateAudit(audit, folder = root) {
  const errors = [];
  if (audit.schemaVersion !== 1 || audit.examVersion !== '2026-07-20')
    errors.push('Unsupported audit version');
  if (audit.baselineCommit !== '184b818a041919b9a6461310c3ba39074e020641')
    errors.push('Unexpected audited baseline');
  if (audit.humanSmeReview !== null || audit.humanLearnerValidation !== null)
    errors.push('Human approval cannot be invented by this audit');
  const expected = Object.entries(counts).flatMap(([group, n]) =>
    Array.from({ length: n }, (_, i) => `${group}.${String(i + 1).padStart(2, '0')}`),
  );
  const rows = audit.objectives ?? [];
  if (
    rows.length !== expected.length ||
    new Set(rows.map((r) => r.slot)).size !== expected.length ||
    expected.some((slot) => !rows.some((r) => r.slot === slot))
  )
    errors.push('Expected exactly all 57 official skill slots');
  if (new Set(rows.map((r) => r.id)).size !== rows.length)
    errors.push('Duplicate stable competency ID');
  const safeFile = (path) => {
    const local = typeof path === 'string' ? relative(folder, resolve(folder, path)) : '..';
    return (
      local && !local.startsWith('..') && !isAbsolute(local) && existsSync(resolve(folder, local))
    );
  };
  for (const [id, source] of Object.entries(audit.sources ?? {})) {
    if (
      !source.url.startsWith('https://learn.microsoft.com/en-us/') ||
      (source.reviewed !== audit.reviewed &&
        !audit.updates?.some((u) => u.reviewed === source.reviewed && u.sources?.includes(id))) ||
      !source.purpose
    )
      errors.push(`${id}: missing official source/review`);
  }
  for (const [id, profile] of Object.entries(audit.evidenceProfiles ?? {})) {
    for (const section of ['teaching', 'mechanism', 'presentation', 'assessment']) {
      if (!profile[section]?.length) errors.push(`${id}: missing ${section} pointers`);
      for (const ref of profile[section] ?? []) {
        if (
          !safeFile(ref.path) ||
          !ref.marker ||
          !readFileSync(resolve(folder, ref.path), 'utf8').includes(ref.marker)
        )
          errors.push(`${id}: unresolved ${section} pointer ${ref.path} / ${ref.marker}`);
      }
    }
    if (!profile.tests?.length || profile.tests.some((path) => !safeFile(path)) || !profile.limits)
      errors.push(`${id}: missing tests/limits`);
  }
  for (const row of rows) {
    const tag = `${row.slot} ${row.id}`;
    if (
      !row.id?.startsWith('az900.') ||
      !row.title ||
      !states.includes(row.status) ||
      !row.observed ||
      !row.gap
    )
      errors.push(`${tag}: missing audit finding`);
    if (
      Object.keys(row.criteria ?? {})
        .sort()
        .join('') !== 'ABCDEF' ||
      Object.values(row.criteria).some((v) => !['V', 'P', 'M', 'U', 'N'].includes(v))
    )
      errors.push(`${tag}: invalid A–F criteria`);
    if (!row.facets?.length || row.facets.some((f) => !f.topic || !states.includes(f.status)))
      errors.push(`${tag}: missing named facets`);
    if (!row.sources?.includes('EXAM') || row.sources.some((id) => !audit.sources[id]))
      errors.push(`${tag}: unresolved sources`);
    if (row.evidence?.some((id) => !audit.evidenceProfiles[id]))
      errors.push(`${tag}: unresolved evidence`);
    if (!row.plannedPRs?.length || row.plannedPRs.some((id) => !audit.plannedPRs.includes(id)))
      errors.push(`${tag}: unresolved next PR`);
    if (!row.localObjectives?.length) errors.push(`${tag}: missing local/professional mapping`);
    if (
      row.status === 'COMPLETE' &&
      (Object.values(row.criteria).some((v) => v !== 'V') ||
        row.facets.some((f) => f.status !== 'COMPLETE') ||
        !row.evidence.length)
    )
      errors.push(`${tag}: false COMPLETE claim`);
    if (
      row.status === 'MISSING' &&
      (row.evidence.length ||
        row.facets.some((f) => f.status !== 'MISSING') ||
        ['A', 'B', 'C', 'D', 'E'].some((c) => row.criteria[c] !== 'M'))
    )
      errors.push(`${tag}: contradictory missing claim`);
  }
  return errors;
}

export function renderMatrix(audit) {
  const lines = [
    '# AZ-900 — sporbar dekningsmatrise',
    '',
    '> Generert fra [auditdata](audits/az900-2026-07-20.json) med `npm run az900:audit:check -- --write`. Rediger funnene i JSON; kontrollen avviser en utdatert matrise. Datafilen importeres aldri av læringsplattformen.',
    '',
    `Kontrollert **${audit.reviewed}**. Offisielt grunnlag: Skills measured **${audit.examVersion}**, fortsatt gjeldende på kontrolldato. Koderevisjon: PR18, \`${audit.baselineBranch}\`, commit \`${audit.baselineCommit}\`. Denne PR-en endrer ingen mål, rubrikk, elevregistrering eller simulatorregel.`,
    '',
    ...(audit.updates ?? []).flatMap((u) => [
      `Scoped update **${u.id}**, ${u.reviewed}: ${u.objectives.join(', ')}. ${u.note}`,
      '',
    ]),
    '## Metode og terskel',
    '',
    'Alle **57 offisielle kulepunkter** er egne rader, fordelt på 11 underområder. Sammensatte krav er dessuten delt i 126 navngitte kontrollfasetter. Fasettene er en lokal auditinndeling, ikke Microsofts spørsmålstall eller en ekstra eksamensvekt. Slot angir rekkefølgen i den daterte studieguideversjonen; stabile `az900.*`-ID-er er audit-/plan-ID-er, foreløpig ikke nye runtime-kompetanser.',
    '',
    '| Kriterium | Hva er kontrollert? |',
    '| --- | --- |',
    '| A | Original, tilgjengelig teori som forklarer målet tilstrekkelig. |',
    '| B | Mekanisme, relasjoner, avhengigheter og viktige grenser. |',
    '| C | Relevant faktisk aktivitet: konseptmodell, beslutning eller støttet lab. |',
    '| D | Ny-kontekst oppgave uten forhåndsløsning; første forsøk/hjelp må skilles. |',
    '| E | Teknisk begrunnelse for riktig svar og plausible feil; bare resultatetikett teller ikke. |',
    '| F | Fagpåstander sammenholdt med relevante offisielle kilder og datert spor. |',
    '',
    '**V** = tilstrekkelig dokumentert for dette avgrensede målet; **P** = delvis; **M** = mangler; **U** = uavklart; **N** = ingen implementert fagpåstand å kildegodkjenne. F=V er en kildekontroll utført av implementerende agent, aldri menneskelig SME-godkjenning.',
    '',
    '**COMPLETE** krever V i A–F og ingen udekkede fasetter. **PARTIAL** betyr reelt bidrag, men minst ett vesentlig krav mangler. **MISSING** betyr ingen målrettet aktiv dekning; en forutsetning, ikon eller fremtidsplan er ikke dekning. **UNVERIFIED** brukes ved uløst faktisk eierskap/tilgjengelighet/kildetvil. Ingen rader trenger den siste kategorien etter denne gjennomgangen; menneskelig review er likevel ikke utført for noen modul.',
    '',
    'D=V betyr at en relevant selvstendig oppgave finnes, ikke at enhver elev har bestått eller at oppgavebanken har psykometrisk gyldighet. Faste og enkle todelte oppgaver begrenser overføringsbevis. Kategoriene gjelder tilgjengelig opplæring, ikke elevscore, offisiell Learn-fullføring eller sannsynlighet for å bestå.',
    '',
    '## Målbare resultater per eksamensområde',
    '',
    '| Område | Offisiell vekt | Kulepunkter | COMPLETE | PARTIAL | MISSING | UNVERIFIED |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const d of audit.domains) {
    const rows = audit.objectives.filter((r) => r.slot.startsWith(`${d.id}.`));
    lines.push(
      `| ${d.id}. ${d.title} | ${d.weight} | ${rows.length} | ${states.map((s) => rows.filter((r) => r.status === s).length).join(' | ')} |`,
    );
  }
  lines.push(
    '',
    'Dette er antall auditerte krav, ikke en samlet deknings-/beståttprosent. Offisiell områdevekting kan ikke fordeles likt på kulepunktene eller brukes til å omregne disse tallene til exam readiness.',
    '',
    '## Evidence-register',
    '',
    'Profilene under gir faktisk kilde/manuskript, mekanisme, tilgjengelig komponent, vurdering og regresjonstester. Hver kravrad presiserer relevant kriterium og hull; en test i en delt profil beviser ikke alle målene i profilen. `nb.ts` inneholder aktive og historiske tekster. De oppgitte v2-/Benefits-/lab-forløpene og det fortsatt tilgjengelige Portal-kompatibilitetsoppdraget teller der de faktisk bidrar. Gamle resultater konverteres ikke til v2-evidens. De 30 profesjonelle kompetansene er grove planområder, ikke 30 implementerte kurs.',
    '',
  );
  const link = (path) => `[${path}](../${path})`;
  for (const [id, p] of Object.entries(audit.evidenceProfiles)) {
    lines.push(`### Evidens ${id}`, '');
    for (const [key, title] of [
      ['teaching', 'Manuskript'],
      ['mechanism', 'Mekanisme'],
      ['presentation', 'Lærerflate'],
      ['assessment', 'Vurdering'],
    ])
      lines.push(
        `- ${title}: ${p[key].map((r) => `${link(r.path)} → \`${r.marker}\``).join('; ')}.`,
      );
    lines.push(`- Tester: ${p.tests.map(link).join(', ')}.`, `- Grense: ${p.limits}`, '');
  }
  for (const g of audit.groups) {
    lines.push(
      `## ${g.id} ${g.title}`,
      '',
      '| Slot / stabil audit-ID | Krav (kort temaetikett) | Status | A B C D E F | Eksisterende lokale mål | Evidens | Neste PR |',
      '| --- | --- | --- | --- | --- | --- | --- |',
    );
    const rows = audit.objectives.filter((r) => r.slot.startsWith(`${g.id}.`));
    for (const r of rows)
      lines.push(
        `| ${r.slot}<br>\`${r.id}\` | ${r.title} | ${r.status} | ${Object.values(r.criteria).join(' ')} | ${r.localObjectives.join(', ')} | ${r.evidence.join(', ') || 'Ingen aktiv dekning'} | ${r.plannedPRs.join(', ')} |`,
      );
    lines.push('');
    for (const r of rows)
      lines.push(
        `### ${r.slot} — ${r.title}`,
        '',
        `**Fasetter:** ${r.facets.map((f) => `${f.topic}: ${f.status}`).join('; ')}.`,
        '',
        `**Faktisk funn:** ${r.observed}`,
        '',
        `**Rest / beslutning:** ${r.gap}`,
        '',
        `**Kilder:** ${r.sources.map((id) => `[${id}](${audit.sources[id].url})`).join(', ')}. Lokal mål-ID er et kartleggingspunkt, ikke automatisk tildelt evidens.`,
        '',
      );
  }
  lines.push(
    '## Daterte offisielle kilder',
    '',
    'Alle lenker ble kontrollert 2026-10-26. «Page updated» er bare registrert der siden oppgav dette; det er ikke automatisk reviewdato. Module/unit-struktur og relevante tekniske forklaringer er lest; ingen komplette Learn-leksjoner eller beskyttede spørsmål er kopiert. Microsofts offentlige Practice Assessment-beskrivelse ble lest; selve innloggede oppgavebanken ble ikke åpnet.',
    '',
    '| ID | Kilde og anvendelse | Synlig versjon/dato |',
    '| --- | --- | --- |',
  );
  for (const [id, s] of Object.entries(audit.sources))
    lines.push(
      `| ${id} | [Microsoft: ${s.purpose}](${s.url}) | ${s.pageUpdated || 'Rolling page; reviewed 2026-10-26'} |`,
    );
  lines.push(
    '',
    'Den offentlige Learn-skallet viste enkelte steder en authorization-melding samtidig som artikkelteksten var lesbar. Ingen tenant, tilgangskontroll eller innlogging ble omgått. Nettkildene er referanser, ikke runtime-avhengigheter.',
    '',
    '## Begrensninger og videre bruk',
    '',
    '- Dette er kilde-/kodeaudit med oppgavekritikk. Ingen kvalifisert menneskelig SME, novice/IT-brukerstudie eller målt læringsoverføring er gjennomført.',
    '- Historiske manuskripter kan være mer omfattende enn den aktive lærerflaten; utilgjengelig historikk er ikke godskrevet. Arkiverte v1-oppgaver oppgraderer aldri v2-evidens.',
    '- Kildesjekken er tilstrekkelig til gapkartlegging. Hvert nytt modulmanuskript må sjekkes mot sine tjenestespesifikke kilder på nytt før implementering.',
    '- [Gap-analyse og Learn-struktur](AZ900_GAP_ANALYSIS.md), [avgrensede PR-er](AZ900_EXPANSION_ROADMAP.md) og [fremtidig vurderingsplan](AZ900_ASSESSMENT_BLUEPRINT.md) utdyper tiltakene. Ingen nye moduler eller prøveeksamen er implementert her.',
    '',
    'Teknisk kontroll: `npm run az900:audit:check` verifiserer fullstendige slots, unike ID-er, kilder, fil-/symbolpekere, planreferanser og logisk COMPLETE-terskel. Den kan ikke avgjøre pedagogisk kvalitet eller om Microsoft endrer mål etter reviewdatoen.',
    '',
  );
  return lines.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = JSON.parse(readFileSync(resolve(root, auditPath), 'utf8'));
  const errors = validateAudit(audit);
  const rendered = await format(renderMatrix(audit), { parser: 'markdown', printWidth: 100 });
  if (!errors.length && process.argv.includes('--write'))
    writeFileSync(resolve(root, matrixPath), rendered);
  if (
    !existsSync(resolve(root, matrixPath)) ||
    readFileSync(resolve(root, matrixPath), 'utf8').replaceAll('\r\n', '\n') !== rendered
  )
    errors.push('Coverage matrix is stale; regenerate with --write');
  if (errors.length) {
    process.stderr.write(errors.join('\n') + '\n');
    process.exitCode = 1;
  } else
    process.stdout.write(
      'AZ-900 audit: 57 objectives / 126 facets, evidence references and generated matrix valid; no educational approval inferred.\n',
    );
}
