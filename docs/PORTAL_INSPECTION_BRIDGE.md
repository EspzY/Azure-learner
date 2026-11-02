# PR-01 Stage A — Practical Portal Learning Bridge

Base `475bddd5b068165528ffa59c288d76c341a914ba`, PR47. Stage A bruker eksisterende kommandoer, World og ledger. Ingen ny ressursmotor, ressursklasse, operasjon, vurdering eller læringsstore.

## Tre avgrensede forløp

| Kursaktivitet                           | Faktisk inspeksjon                                                                                                              | Opprinnelig retur                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Compute → VM Resources & Dependencies   | Velg eksisterende VM; image/profil/Properties, disk/NIC/subnett/VNet og original opprettelsesreceipt                            | `/learn/compute?topic=dependencies`, `compute=vm`                         |
| Governance → Studio → Policy            | Velg faktisk `policy-location-denied`; innsendt konfigurasjon, scope/assignment, uendret revisjon/antall og eksisterende gruppe | `/learn/governance?topic=studio&perspective=policy`, `governance=policy`  |
| Management Tools → Studio → Same Intent | Velg faktisk Web App; gruppe/plan, opprinnelig forespørsel, nåværende konfigurasjon og separat endringshistorikk                | `/learn/management-tools?topic=studio&perspective=intent`, `tools=intent` |

Velgeren bruker gjeldende SandboxProvider og bare faktiske objekt-/receipt-ID-er. Ingen automatisk opprettelse eller ny guidet økt. Tomt/manglende/usikkert miljø gir en forklaring og eksisterende praktisk aktivitet/retur, ingen erstatningsressurs. En historisk guide beholder sitt opprinnelige tekniske forsøk; inspeksjonslenker flytter ikke dens boundary eller gamle observasjoner. Nye frie inspeksjoner gir ingen kreditt. Eksisterende eksplisitte observasjonsknapper beholder sin opprinnelige kontrakt.

## Minste tekniske endring

`domain/portal/inspection.ts` er en ren projeksjon. ResourceEvidence knytter original ledger til valgt objekt. **Direkte ID**, **referert avhengighet** og **scope** er forskjellige koblingsgrunnlag; ingen av dem omtolker en avvist request til en ressursendring. Historiske receipts bevares også når objektet er slettet. ReceiptReferences viser bare støttede skalare forespørselsfelt og gjeldende objektreferanser; ukjente felt blir ikke et generelt debug-/hemmelighetspanel. Original forespørsel beholdes i ledger/eksport.

Scope-utvalg følger den faktiske management-hierarkien; historiske CreateGroup-receipts gir korrekt ancestry også etter sletting av en tom gruppe. Identitetskontekst omtolkes ikke til et ARM-scope.

Den tidligere ressursmenyen sendte ressurs-ID til en Activity log som forventet command-ID, og viste dermed hele loggen. Nå avgrenser `resource=<ID>` operasjonstabellen, og valgt `id=<command-ID>` åpner samme originale receipt. «Vis alle operasjoner» er eksplisitt tilgjengelig. Eldre `activity&id=<resource-ID>` støttes også. En receipt som ikke tilhører angitt ressurs, blir ikke vist under feil filter. Ukjent ID velger ingen annen operasjon automatisk.

`PortalLocation`/`portalHref` utvides bare med tillatt `view` på ressursvisning og validert `resource` på Activity log. Ressursmenyens Overview/Properties/relasjoner bruker URL-en, så Back/Forward og reload bevarer valgt perspektiv. Ingen ny persistent preferanse, origin-/resume-motor eller fullføringsstatus. Eksisterende native Compute-, Governance- og Tools-returer gjenbrukes. Nytt ressursvalg nullstiller forrige visning/filter; kurs-/oppdragsflagget beholdes. Fokus flyttes til ressursinnhold ved perspektivskifte uten nytt sidescrollhopp.

## Teaching, independent og bevaring

Kursens nye spørsmål og refleksjoner monteres **innen eksisterende ManagementTeachingBoundary**. Avvist durable aid-write viser ikke broen; tidligere uassistert draft og eksakt resume bevares. Portalens vanlige ressursfelter, opprinnelige receipts, støttede request-felt og ID-lenker er nøytrale tekniske fakta, ikke nye løsningshint. De gir ikke automatisk hjelp eller kreditt. Å følge disse under independent bevarer førsteinnlevering/help-status; å returnere til forklarende kursinnhold krever opprinnelig durable preflight. SavvyShark undertrykkes fortsatt ved independent/usikkerhet og kan gjenfinnes i gyldig guidet kontekst.

Alle tidligere Sandbox-/Chapter-/curriculum-/course-domener, kildebanker, rubrics, first/help/retry, World-schema, command-semantikk, receipt-ID-er/utfall og XP er uendret. Kun Portal-modellens navigasjonsdel er utvidet. Den opprinnelige tekniske delen fra `InventoryKind` og videre er byte-sammenlignet mot basen. PR47s kildebevaringstest er oppdatert til levert PR47-base og har tre eksplisitte unntak for den autoriserte navigasjonsmodellen og nye rene inspeksjonsfiler; alle andre domenefiler og hele opprinnelige locale-prefikset er fortsatt bytebeskyttet. Alle opprinnelige kilde-/rubric-/store-assertions beholdes. Dette er ikke et unntak for tekniske regler.

## Referanse og faktisk før/etter

Microsofts offentlige [Portal overview](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-overview), [VM overview](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/overview), [plan-administrasjon](https://learn.microsoft.com/en-us/azure/app-service/app-service-plan-manage) og [Activity log](https://learn.microsoft.com/en-us/azure/azure-monitor/fundamentals/activity-log) ble innholdsverifisert 2. november2026. De offentlige Portal-callout- og Activity-log-bildene ble faktisk inspisert; de er ikke kopiert inn i produktet. Eksisterende offisielle ikoner/manifest og SVG-bytes beholdes.

| Referanse                                    | Implementert samsvar                                                        | Bevisst grense                                                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Ressursmeny, Overview/Properties, Essentials | Gjenkjennelige navn, fungerende ID-/scope-/planreferanser og menynavigasjon | Lokal konfigurasjon, ingen Azure ARM-ID, CPU, availability, IAM eller runtime                                       |
| Ressursavgrenset Activity log                | Valgt ressurs og original operasjon/receipt med tydelig koblingsgrunnlag    | Lokal ledger, ingen Azure Monitor-feed, tidsstempler eller 90-dagers Azure-retensjon                                |
| VM og app/plan                               | Faktiske eksisterende objekter/relasjoner fra samme World                   | Opprinnelige bounded profiler/avhengigheter; ingen migrering, resize, selvstendig NIC/VNet CRUD eller deployet kode |

Før-bilder er fra anonym PR47-preview, etter-bilder fra kandidatens produksjonsbygg med identisk originalt kommandoprodusert fixture. Samme VM-inngang viser **8 operasjoner før → 1 relevant operasjon etter**, uten å fjerne noen receipt; hele loggen kan fortsatt åpnes. [VM-kurs før](screenshots/portal-inspection/before-course-vm-1440.png) / [etter](screenshots/portal-inspection/after-course-vm-1440.png), [historikk før](screenshots/portal-inspection/before-vm-history-1440.png) / [etter](screenshots/portal-inspection/after-vm-history-1440.png), [Policy-receipt før](screenshots/portal-inspection/before-policy-receipt-1440.png) / [etter](screenshots/portal-inspection/after-policy-receipt-1440.png), [Properties ved1024×500](screenshots/portal-inspection/after-properties-1024x500.png). Ingen falske tekniske receipts ble brukt; fixture genereres av original SandboxStore.

## Verifikasjon og videre fase

Åtte nye pure-domain-tester pluss opprinnelige Portal-/kildebevaringstester kontrollerer ID-er, koblingsgrunnlag, sletting/endring, ukjente request-felt, navigasjonsvalidering og uendrede tekniske bytes. Seks nye desktop-forløp og én faktisk kompakt kjøring gir **303 =278 desktop+25 kompakt**, alle296 tidligere bevart, valgfri legacy556. Innstillinger/retries/timeouts/workers/skips er uendret. Faktiske målrettede produksjonsreiser dekker tre kursreturer, avhengigheter, opprinnelig request versus nåværende settings, manglende/slettet/ugyldig objekt, feil receipt/ressurs-par, cross-tab-konflikt, denied aid, nøytral independent og eksakt draft-resume. Tastatur/fokus/scroll, reduced motion og Axe testes i initial kompakt,1920/1440/1366/1024×768/1024×500.

Tidlige feil var en unsupported16GiB testfixture, en manglende lokal kompakt-config og SPA-reload før destinasjon var committed; de ble korrigert til originalt støttet32GiB, korrekt eksisterende kompaktprosjekt og eksplisitt URL-avventing. Full check fanget også en testfixture med et nestet objekt der original request-kontrakt bare tillater skalare verdier; fixturen ble korrigert til skalar. Ingen assertions eller simulatorregler ble svekket. Faktisk bildeinspeksjon identifiserte global select-styling; korreksjonen er scopet til den nye broen.

Full check, korrekt stamp, separat seksdomene-audit, autoritativ eksakt-head303 CI/streng release og faktisk anonym full-SHA Gate7 dokumenteres på Draft PR48 før Stage A er godkjent. Stage B/C, PD-01 og AS-02 gjenstår. Menneskelig Azure-SME/nybegynner-/UX-/skjermleser-/læringsvalidering er uutført. Ingen målt læringseffekt, full Portal-paritet, merge, produksjonsdeploy eller P17/P18.
