export const laboratoryEphemeralNb = {
  start: 'Start midlertidig Sandbox uten lagring',
  entry:
    'Utforsk alle støttede tjenester uten innlogging. Arbeidet ligger bare i denne fanen og forsvinner ved ny innlasting.',
  mode: 'Midlertidig Sandbox · nullstilles ved ny innlasting · ingen kursresultater eller XP',
  status: 'Midlertidig – ingen lagring · nullstilles ved ny innlasting',
  result: 'Simulert kommandoresultat',
  accepted:
    'Kommandoen er evaluert. Endringen finnes bare i denne fanens midlertidige arbeidsområde.',
  rejected: 'Kommandoen er avvist. Ingen delvis ressursendring ble utført.',
  evidence:
    'Historikken kan replay-verifiseres i denne fanen. Den er ikke varig serverlagring eller vurderingsbevis.',
  refresh: 'Oppdater visningen',
  reset:
    'Bare ressursene i denne midlertidige Sandboxen fjernes. Kommandohistorikken beholdes i fanen frem til ny innlasting. Kursarbeid og serverlagrede arbeidsområder påvirkes ikke.',
  persistentUnavailable:
    'Serverlagring er ikke tilgjengelig her. Du kan bruke den midlertidige Sandboxen.',
  limits:
    'Bruk bare syntetiske data. Samme støttede ressursregler og kapasitetsgrenser gjelder. Ingen ekte Azure-ressurser opprettes. Historikken er avgrenset; ved full historikk kan du starte tomt ved å laste siden på nytt.',
} as const;
