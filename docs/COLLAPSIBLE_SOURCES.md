# UX-02 — Kilder og videre lesning

PR47 endrer bare presentasjon av eksisterende kilder mot base `baf68a90d80cb22b0397a5a34e9c20809110eb84`. SourceDisclosure er native details/summary, lukket ved montering, med korrekt antall, ID, eksisterende tittel/etikett og trygg ekstern lenke. Ingen lagret åpen-preferanse, ny innholdsmotor eller læringshendelse. Enter/Space og nettleserens ekspandert-semantikk brukes uten redundant ARIA.

## Omfang og bevaring

23 eksisterende kildefiler / 26 kallesteder bruker samme komponent. De 13 moderne bankene omfatter Compute, Networking A/B, Storage A/B/C, Identity A/B/C, Cost, Governance, Management Tools og Monitoring: **377 registrerte kildeoppføringer**, ikke 377 unike dokumenter. Hvert faktisk topic-utvalg og hver Summary testes mot den uendrede banken. Kostnad har sitt opprinnelige topic-/Summary-utvalg; Monitoring har motsatt tuppelrekkefølge fra flere andre banker, håndtert eksplisitt.

Også Core Architecture A/B, Serverless, Foundations v1/v2, Benefits, Services v1/v2, eldre teaching Journal, Portalens fire undervisnings-/referanseflater, opprinnelige missions/practical lab og Cloud Transfer-resultatets referanseliste er tilpasset. Global Course Journal gjenbruker allerede modulkomponentene. Adapterne beholdt de opprinnelige kildevalgene og notene; Cloud Transfer-feedback er uendret.

Alle `src/domain/`-filer er byteidentiske med basen, inkludert kilderegistre, claim mappings, reviewdatoer, rubrics, stores, World og receipts. Hele opprinnelige `nb.ts` er bevart som identisk prefiks; bare en felles visningsetikett er lagt til. Ingen titler eller datoer er oppfunnet. Der bare ID/URL fantes, brukes den tidligere ærlige path-etiketten eller eksisterende lesbar referanseetikett. Kontrollmetadata vises bare der den allerede finnes; ingen ny universell dato tillegges eldre referanser.

Korte inline-kilder ved bestemte utsagn og Portalens dokumentasjonssøkeresultater er fortsatt synlige. Dette er kontekstuelle lenker, ikke åpne bibliografier. Lineage-kilder er datakilder og omfattes ikke. Alle vesentlige modellbegrensninger, human-validation-noter og feedback forblir utenfor disclosure. Foundations-noten om syntetisk kapasitet/ingen Azure-priser står nå eksplisitt utenfor.

## Journal og integritet

Disclosure er presentasjon, **aldri en teaching boundary**. Alle opprinnelige ManagementTeachingBoundary-/durable aid-/independent-/cross-tab-grenser er bevart. Avvist assistance-write eller konflikt monterer ikke beskyttede kilder. Toggling av lovlig tilgjengelige kilder skriver ingen evidence eller preferanser. Historiske og oppdaterte Benefits-/Services-versjoner, førsteinnleveringer, retry, guided state, resume, XP og SavvyShark er uendret.

## Faktisk før/etter

Målt med getBoundingClientRect ved 1440×900 i anonym PR46-preview og kandidatens produksjonsbygg. Arealet er hele kildeseksjonen, inkludert fortsatt synlig valideringsforbehold; derfor større enn selve kildeinngangen.

| Flate                           | Kilder | Før, px | Etter, px | Reduksjon |
| ------------------------------- | -----: | ------: | --------: | --------: |
| Security Summary                |     28 |     920 |        95 |    89,6 % |
| Governance Summary              |     36 |    1178 |        91 |    92,2 % |
| Management Tools Summary        |     40 |    1300 |        91 |    93,0 % |
| Tools-kontekst i global Journal |     40 |    1654 |       119 |    92,8 % |

Alle ankrenes tekster og href-er i disse fire faktiske DOM-uttrekkene er nøyaktig like før/etter. [Maskinell bevaring og mål](reviews/evidence/source47-preservation.json). Personlig inspiserte par: [Security før](screenshots/collapsible-sources/before-security-1440.png) / [etter](screenshots/collapsible-sources/after-security-1440.png), [Governance før](screenshots/collapsible-sources/before-governance-1440.png) / [etter](screenshots/collapsible-sources/after-governance-1440.png), [Tools før](screenshots/collapsible-sources/before-management-tools-1440.png) / [etter](screenshots/collapsible-sources/after-management-tools-1440.png), [Journal før](screenshots/collapsible-sources/before-journal-1440.png) / [etter](screenshots/collapsible-sources/after-journal-1440.png). Journal beholder sentrert native dialog og scrollbar; [åpen liste ved 1024×500](screenshots/collapsible-sources/open-security-1024x500.png) bruker én lesbar kolonne med ordbrudd og vanlig sidescroll.

## Verifikasjon og begrensninger

Tre strukturelle tester kontrollerer native lukket standard, metadata, trygge lenker, alle moderne topic-/Summary-utvalg, 377 bankoppføringer og domenebevaring. Fem nye desktop-tester og én faktisk kompakt PC-test gir 296 planlagte kjøringer (272 desktop/24 kompakt); alle 290 tidligere beholdes. Ingen endrede retries, timeouts, workers eller skips. Faktiske målrettede produksjonstester dekker eldre kilder, Storage A/B/C, Cost/Compute, Journal, begge nye assessment-kontekster, avvist aid, ugyldig direkte topic og cross-tab-unmount. Sju tidligere kritiske browserkontroller for historisk rubric, denied Journal, dialoger og pauset guide består.

Tastatur, fokus/Escape-retur, redusert bevegelse, Axe uten funn og scroll uten hopp er testet. Faktiske 1920×1080, 1440×900, 1366×768, 1024×768, 1024×500 og initialt kompakt 800×700-vindu, ekte Chromium 200 % browserzoom og dobbel tekst testes uten horisontal overflow. Tidlige testfeil skyldtes feil topic-antakelse og forventet historisk versjonsvalg; testene ble rettet uten produkt- eller assert-svekkelse.

Full npm check, separat post-stamp seksdomene-audit, autoritativ komplett eksakt-head CI, streng release og anonym ekstern full-SHA Gate7 dokumenteres på Draft PR47 før UX-02 godkjennes. Ready eller lokale tester alene lukker ikke funnet. Menneskelig Azure-SME-, novice UX-, skjermleser-, psykometrisk og målt læringsvalidering er uutført. Åpne lange lister krever fortsatt vanlig scrolling; native åpen tilstand er bevisst ikke varig lagret. Ingen ny faglig revisjon av alle 57 mål eller nye kontrolldatoer er påstått.

Neste er en kort eierprioritering av PD-01, AS-02 og PR-01 samt faktisk menneskelig validering, ikke automatisk P17/P18. Ingen merge eller produksjonsdeploy.
