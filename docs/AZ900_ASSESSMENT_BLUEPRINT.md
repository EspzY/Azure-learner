# AZ-900 — fremtidig diagnostikk og læringsoverføring

## P05 implemented Compute application

Fourteen original cases span guest control/event/lifecycle, fleet/FD-UD/AVD/dependency failure, VM storage/network/configuration and orchestration/HTTP/batch hosting. Each pairs a decision with its reason and candidate-specific feedback; multiple defensible HTTP and batch pairs are supported. Scenario family, item/rubric version, first/help/retry/abandon and exact lesson links remain separate from prior evidence. Guided models never supply independent credit. No general diagnostic engine, psychometric validation or readiness claim. [Actual case map](COMPUTE_HOSTING.md).

## P04 implemented independent application

Cost Management uses ten original versioned item/rubric cases in five families, two distinct contexts each for drivers, calculator, cost management, tags and Learn optimization. Each requires a compatible decision and structured reason; a correct decision with a wrong cause fails. Feedback follows submission and explains all six alternatives, misconceptions, changed assumptions and exact lesson links. An already exposed family is a retry. Durable teaching preflight includes every active cost/older independent context before Journal, Summary or historical feedback. This finite bank is not the proposed diagnostic exam, does not award XP and supplies no readiness percentage. [Actual contract](COST_MANAGEMENT.md).

## Implementert P03-avgrensning — PR25

P03 er et isolert selvstendig transfer-spor i det eksisterende kurset, ikke den generelle diagnostiske prøveeksamenen nedenfor.19 originale tilfeller i sju familier bruker eksplisitt koblede beslutninger og begrunnelser; ett tilfelle godtar to faglig gyldige arkitekturer med hver sin ansvarsbegrunnelse. Førstesvar, familieeksponering, hjelp, retry og avbrudd replays separat fra historiske rubrics. Historisk feedback og presis repetisjon bruker durable teaching-preflight på tvers av alle vurderingskontekster. Ingen fordeling som etterligner full eksamen eller readiness-score er implementert. [P03-kontrakt](CLOUD_CONCEPTS_TRANSFER.md).

Designversjon 1.0.0, 2026-10-26. **Plan, ikke implementert prøveeksamen.** Dagens faste oppgaver, rubrikker, first/help/retry, XP og lagring endres ikke av denne PR-en. [Matrisen](AZ900_COVERAGE_MATRIX.md) viser hvilke ferdigheter som allerede har relevante oppgaver og hvilke som ikke har det.

## Formål og etiske kildegrenser

Diagnostikken skal finne hvilke konsepter studenten kan anvende i nye situasjoner og sende vedkommende tilbake til konkret undervisning. Den skal ikke utgi seg for Microsofts eksamen, gi Microsoft Learn-fullføring eller love bestått.

Microsofts [offentlige Practice Assessment-beskrivelse](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications), kontrollert 2026-10-26, forklarer oppgavetyper og tilbakemelding, men er ikke en kilde for AzureLabs spørsmål. Dens spørsmål er ikke de faktiske eksamensspørsmålene, og øvelsen erstatter ikke opplæring/erfaring. [FAQ](https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions) understreker forskjellen fra tredjepartsforberedelse. Selve innloggede banken er ikke åpnet eller kopiert i denne auditen.

Forfattere bruker offisielle tekniske fakta og dokumenterte misforståelser til **selvstendige oppgaver**. Ingen innhenting, omskriving eller rekonstruksjon av eksamensdumper, ITExams eller Microsofts beskyttede practice-spørsmål. Kilder registreres per fagpåstand; forfatterproveniens og gjenbruksrett dokumenteres. En lenke er ikke fagreview.

## Adskilte vurderingsmodi

| Modus                 | Hjelp og feedback                                                                             | Hva kan registreres?                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Guided practice       | Eksempel, hint og årsaksforklaring underveis                                                  | Øvelse/assistanse, aldri unaided eller readiness.                                         |
| Uavhengig diagnostikk | Krav og tilgjengelighetsstøtte; ingen løsningshint, coach-highlights eller fasit før levering | Første låste innlevering, primærmål, familiekjennskap, faktisk hjelp og ufullført status. |
| Transfer/holdout      | Tidligere usett oppgavefamilie med ny begrensning/struktur; ingen veiledet tvilling først     | Første unaided anvendelse, senere gjerne forsinket ny familie. Ikke mastery-garanti.      |
| Review/retry          | Forklaring av alle alternativer, lenke til nøyaktig teori, nye forsøk                         | Læring etter feedback; tidligere first-resultat blir ikke erstattet.                      |

Tekststørrelse, skjermleser og redusert bevegelse er tilgjengelighet, ikke løsningshjelp. Oppslag i løsning/hint eller relevant målrettet fasit registreres som hjelp; en ekstern bruker kan likevel manipulere lokal lagring. Lokale resultater er derfor ikke sertifiserbare eller autoritative. Dersom teori åpnes under et uavhengig forsøk, bevares svarutkastet, men forsøket klassifiseres etter den gjennomgåtte hjelperegelen. Browser tilbake/reload gjør det aldri «første» igjen.

## Forslag til typed, versjonert kontrakt

Dette er et designskjema, ikke runtime-kode eller et nytt skjult evidence-system:

```ts
type DiagnosticItem = {
  id: string; // immutable original item ID
  version: string;
  familyId: string; // shared reasoning structure, not just equal topic
  variantId: string;
  primaryObjectiveId: string; // stable az900.* binding
  secondaryObjectiveIds: string[]; // useful feedback, no double weighting
  facetIds: string[];
  examVersion: '2026-07-20';
  mode: 'practice' | 'diagnostic' | 'holdout';
  interaction: 'decision' | 'comparison' | 'classification' | 'prediction';
  scenario: string; // authored localized content key, not executable code
  assumptions: string[];
  responseOptions: {
    id: string;
    contentKey: string;
    rationaleKey: string; // why correct or wrong under these requirements
    misconceptionId?: string;
  }[];
  rubricId: string; // registered deterministic validator
  rubricVersion: string;
  sourceIds: string[];
  teachingActivityIds: string[];
  remediationLinks: string[]; // allowlisted exact unit/activity, no open redirect
  review: {
    sourceCheckedOn: string;
    authorRecord: string;
    qualifiedSmeRecord: string | null;
    learnerPilotRecord: string | null;
  };
};
```

Senere implementering må låse variant/rubric/source/examversjon og primærmål i forsøkets startrecord. Eventbasert first-delivery registreres før feedback. Itemversjon alene nullstiller ikke familieeksponering. Valider hele persisted input, blant annet versjon, duplikate command/event-ID-er, tilstandsovergang og draft-svar; replay må gi samme resultat. En ødelagt eller ukjent record blir ikke et bestått forsøk. Best-effort storage-feil må være synlig og kan ikke tvinge migrering av eldre stores.

Forklaring, scoring og UI holdes adskilt. Renderer kan ikke tildele poeng basert på visning/tid/animert overgang. Coach kan lese status og foreslå allowlisted navigasjon, men skal aldri svare eller utføre tekniske kommandoer for studenten. Svarnøkler kan ikke sikres mot en utvikler i et klientprodukt; ikke hev anti-cheat-egenskaper som krever serverautoritet.

## Vekting og formutvalg

[Gjeldende studieguide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) angir intervaller, ikke vekt per individuelt kulepunkt. Et fremtidig **40-oppgavers** lokalt diagnostisk skjema kan bruke:

| Primærområde          | Oppgaver | Andel i dette designforslaget | Offisielt intervall |
| --------------------- | -------: | ----------------------------: | ------------------- |
| Cloud concepts        |       11 |                        27,5 % | 25–30 %             |
| Architecture/services |       15 |                        37,5 % | 35–40 %             |
| Management/governance |       14 |                          35 % | 30–35 %             |

40 er et lokalt designvalg, ikke Microsofts faktiske spørsmålsantall. Hver oppgave teller én gang etter primærområde; sekundære mål brukes i feedback. Fordeling innen underområdene må også oppgis i formmanifestet og faggranskes; ikke jevnfordel blindt over 57 svært ulike kulepunkter.

For et første reviewer-formforslag kan 11 fordeles 5 computing / 3 benefits / 3 service types, 15 fordeles 4 core / 4 compute-network / 3 storage / 4 identity-security, og 14 fordeles 4 cost / 3 governance / 4 deployment-tools / 3 monitoring. Dette er ingen Microsoft-undervekting. Alle 11 underområder må være representert, men én form kan ikke måle alle 57 mål eller 126 fasetter pålitelig. Flere former må rotere med dekningslogg; områder med få observasjoner markeres «utilstrekkelig grunnlag».

Selectoren bør være deterministisk fra et låst seed og tilgjengelige review-godkjente item-ID-er, med krav til områdekvote, underområde, interaksjonstype, eksponert familie og kildeversjon. Ingen løsning gjennom spørsmålsrekkefølge. Dersom banken mangler egnede items, rapporteres manglende dekning; den skal ikke fylle med duplikater, guided items eller ubekreftet AI-generering. Ingen full readiness-visning før fagdekning og bank er tilstrekkelig gjennomgått.

## Oppgavetyper og kvalitetskrav

- **Begrep med moteksempel:** Skill provisioning fra «alt på internett er cloud», eller autentisering fra autorisasjon. Definisjonsgjenkjenning alene gir smalt bevis.
- **Situasjonsvalg:** Velg tjeneste ut fra OS-kontroll, ferdig funksjon, arbeidsmønster og vedlikeholdsansvar. Tillat flere begrunnede arkitekturer når kravene faktisk gjør dem gyldige.
- **Sammenligning:** Samme krav, ulike konsekvenser for tilgjengelighet, kostnad eller retained ansvar. Ikke «Azure er alltid best».
- **Prediksjon:** Lås svaret før en avgrenset modell kjøres; enheter/forutsetninger skal være kjent, men worked example må ikke røpe dette resultatet.
- **Teknisk beslutning/inspeksjon:** Bruk faktisk inventory/receipt der operasjonell praksis gir ekstra verdi. Ikke krev full operasjonell simulering for et rent produktformål.

Hvert feilalternativ må være plausibelt fordi det gjenspeiler en definert misforståelse, ikke fordi formuleringen er språklig villedende. Etter levering forklares hvorfor det er feil **under de oppgitte kravene**, og når det eventuelt kunne vært riktig. Unngå absolutte påstander uten tjenestespesifikke kvalifikasjoner. Testens logiske atom er itemet/oppgaven, ikke antallet avkryssinger; flere kriterier fra samme scenario er korrelerte observasjoner.

## Originale item-skisser for senere forfatterskap

Disse er selvstendige designskisser, ikke implementerte eller review-godkjente spørsmål. Ikke tell dem som dagens dekning eller gjenbruk dem som unseen holdout etter denne gjennomgangen.

### SK01 — Serverless er en driftsmodell, ikke en universell pris

**Primærmål:** `az900.cloud.serverless`. **Situasjon:** Et team har en hendelsesutløst kort prosess og ønsker minst mulig gjeste-OS-arbeid. En kollega hevder at alle serverless-hostingvalg dermed koster null mellom hendelser. **Beslutning:** Vurder påstanden og hva som må undersøkes før valg.

- **Begrunnet svar:** Hendelsesutløst administrert utførelse kan passe, men valgt hostingplan, reserverte/varme instanser og andre tjenester påvirker kostnad og grenser. Koden/data/access forblir teamansvar.
- **Feilalternativ A:** «Null hendelser garanterer null regning.» Blander et forbrukseksempel med alle planer/tilhørende ressurser.
- **Feilalternativ B:** «Serverless betyr ingen fysisk server.» Blander abstraksjon av drift med fravær av maskinvare.
- **Feilalternativ C:** «Leverandøren tar alt kode-/datatilgangsansvar.» Blander OS-drift med applikasjonsansvar.
- **Kilde:** [Functions overview](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) og [shared responsibility](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility). Remediation: fremtidig P00 trigger/ansvar/hosting-enhet.

### SK02 — Fysisk region og management-scope

**Primærmål:** `az900.architecture.regions`. **Situasjon:** En RG har metadata i Norway East. App og plan finnes i West Europe. Teamet legger en ekstra app i samme RG og antar at dette automatisk gir parbasert failover. **Beslutning:** Velg hvilken dokumentasjon/konfigurasjon som mangler før de kan hevde resilience.

- **Begrunnet svar:** RG gir management/lifecycle, ikke feilbeskyttelse. Appens tjeneste-/regions-/zone-/recovery-oppsett må vurderes; metadata flytter ikke appen. Regionspar er ikke automatisk app-failover.
- **Feilalternativ A:** «Flytt bare gruppemetadata.» Endrer ikke medlemsressursenes plassering/tilgjengelighet.
- **Feilalternativ B:** «Samme subscription gir annen fysisk feilgrense.» Blander styring og geografi.
- **Feilalternativ C:** «Alle regioner har automatisk failover til et par.» Strider mot region-/tjenestespesifikke vilkår og ikke-parede regioner.
- **Kilde:** [Region pairs](https://learn.microsoft.com/en-us/azure/reliability/regions-paired) og [ARM](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview). Remediation: P01 og P02. Ingen faktisk recovery er simulert.

### SK03 — Kontroll av konfigurasjon versus tilgang

**Primærmål:** `az900.governance.policy`. **Situasjon:** En tillatt konfigurasjon opprettes i en godkjent region. En medarbeider mener dette også beviser at alle teammedlemmer har nødvendig, men begrenset administrasjonstilgang. **Beslutning:** Identifiser hvilken separat mekanisme som må vurderes.

- **Begrunnet svar:** Azure RBAC principal/role/scope må vurderes separat; den lokale location-regelen sjekker konfigurasjon, ikke personens tillatelser eller full compliance.
- **Feilalternativ A:** «Regiongodkjenning viser least privilege.» Ingen kobling mellom regionfelt og passende rolletilgang.
- **Feilalternativ B:** «ReadOnly-lock erstatter riktig rolle.» En lock er en annen kontroll med egne grenser, ikke en identitets-/rolletildeling.
- **Feilalternativ C:** «SaaS-produktets lisensrolle gjelder automatisk i abonnementet.» Produktadministrasjon er ikke Azure RBAC.
- **Kilder før implementering:** [Policy overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview). Disse må gjennomgås på nytt ved faktisk itemforfatterskap; skissen er ikke nåværende fagreview-godkjenning. Remediation: P11/P12.

## Diagnostisk rapport og remediering

Rapporten viser per stabilt mål: hvilke versjonerte itemfamilier som ble prøvd, første unaided resultat, praktiserte/hjelpte resultater, antall uavhengige kontekster, siste observasjon og utestående fasetter. Ikke bland «leste emnet», guided-complete og selvstendig riktig i én grønn progressbar.

Anbefalinger knyttes til eksakt enhet/aktivitet, for eksempel «scope versus geografi» fremfor bare «les architecture igjen». En feil i hostingdependency kan sende eleven til den faktiske plan/app-inspeksjonen, mens et regionspar-motspørsmål sender til konseptmodellen. Usikker eller manglende dekning skal stå eksplisitt. En prosent kan beskrive denne konkrete formens riktige svar, men kan ikke konverteres til Microsoft-skala, sertifiseringsstatus eller bestått-sannsynlighet.

## Hvordan senere måle overføring

1. Forfatt familier med samme kompetanse, men nye relevante begrensninger, beslutningsstruktur og feilmønster. Bare andre tall/navn er ikke tilstrekkelig.
2. Skill treningsfamilier fra holdout før elever ser dem. Logg eksponering, inkludert review/hint. Ingen holdout-tvilling i worked example.
3. Samle første unaided løsning på flere strukturelt ulike oppgaver; planlegg forsinket gjenhenting med en annen familie. Vis lite datagrunnlag som usikkerhet, ikke mastery.
4. Bruk kvalifisert fagreview til å kontrollere fakta, entydige krav og gyldige alternative arkitekturer; bruk novice og IT-erfarne deltakere til å finne misforståelser og UX-hindre.
5. Analyser faktisk feilfordeling, ledende spørsmål, alternativbruk og eventuell avhengighet mellom items. Revider versjoner uten å skrive om historiske svar.
6. Definer eventuelle lokale mestringsterskler etter review/pilot, ikke gjennom en vilkårlig «80 % er klar»-regel. Ingen beståttgaranti. Observasjonene forblir lokale og ikke sertifiserte.

## Implementerings-/testgater

P17 bygger bare den godkjente kontrakten og selector med fixtures; P18 bygger en reviewbar original bank og pilot. Begge følger [PR-planen](AZ900_EXPANSION_ROADMAP.md). Test minst ugyldige IDs/kilder, manglende mål, familieduplikater, umulige vekter, data før/etter feedback, første/hjelp/retry, avbrudd/reload, ukjent/ødelagt lagring, gammel rubrikk og exact remediation-return. Strukturvalidering kan aldri sette `qualifiedSmeRecord` eller `learnerPilotRecord`.
