# AZ-900 · demonstrasjon 9. november 2026

Dette er en produktdemonstrasjon av original undervisning og en lokal simulator. Den viser ikke en produksjonslansering, faktisk Azure-drift eller dokumentert læringseffekt. Bruk den SHA-verifiserte PR-previewen som er oppført i release-readiness-notatet.

## Før møtet

Åpne et nytt privat nettleservindu og vanlig root. Kontroller hele commit-SHA-en i «Bygginformasjon». Behold dette vinduet gjennom demonstrasjonen; historikken er lokal og forsvinner når privatøkten avsluttes. Ikke nullstill en eksisterende elevprofil, importer ferdige resultater eller slett kollegaens lagring. Et nytt privat vindu er også den enkleste, trygge omstarten.

Bruk helst 1440×900 eller større, normal zoom og stabil nettforbindelse til previewen. Kontroller previewen samme dag. Ved et kort vindu kan Portalens sidemeny være sammenlagt; bruk menyknappen eller den allerede åpne ressurslisten. En forklarende SavvyShark-dialog må leses/lukkes før kontrollene bak den brukes.

## Anbefalt klikkefølge

| Steg | Handling                                                                                                                                                                                 | Det vi skal se og forklare                                                                                                                                                              |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Root → Course Hub → «Begynn med cloud computing».                                                                                                                                        | Tre fagområder, seks grunnøkter og vanlig Neste/Fortsett. Ingen besøkt side fremstilles som fullført læring.                                                                            |
| 2    | «Kapasitet og etterspørsel»: behold 6 pakker/time, forutsi 2 og kjør. Velg så 10, forutsi 0 og kjør igjen.                                                                               | Samme etterspørsel: udekket behov i topptimen går fra 2 til 0; ubrukt kapasitet øker. Arbeidspakkene er undervisningsenheter, ikke VM-ytelse eller priser.                              |
| 3    | Kursoversikt → Cloud Concepts → «Oppdrag og vurderinger» → «Governance · undersøk avslag og korreksjon». Les briefen og trykk eksplisitt Start.                                          | Faktisk guidet oppdragsøkt, riktig kursretur og tilgjengelig SavvyShark. Åpning av briefen starter ingenting.                                                                           |
| 4    | Resource groups → Create: App Sandbox, `rg-demo-web`, Norway East → Review + create → Create.                                                                                            | En faktisk lokal ressursgruppe og original kvittering. Gruppens region gjelder metadata.                                                                                                |
| 5    | App Service plans → Create i samme gruppe: `plan-demo-web`, North Europe → Review + create → Create.                                                                                     | Faktisk Policy-avslag: `policy-location-denied`, samme World-revisjon og ingen ny plan. Åpne policyen og sammenlign scope, ressurstype og tillatt lokasjon.                             |
| 6    | Opprett planen på nytt i West Europe. Opprett `app-demo-web` i samme gruppe og velg denne planen.                                                                                        | Aksepterte lokale operasjoner. Appens hosting-referanse peker på den faktiske planen; runtime og helse er ikke målt.                                                                    |
| 7    | Velg appen i oppdraget. Bruk «Bekreft observasjonen» på app, plan, gruppe, subscription, policy og de to etterspurte kvitteringene. Returner via «Tilbake til kurset», begrunn og lever. | Oppdragsdebrief bygger på utført arbeid. Avslag er ikke en sikkerhetsfeil eller RBAC-test; senere aksept er ikke samlet compliance-godkjenning.                                         |
| 8    | Vis Services → IaaS → det guidede «bygg for et konkret gjestekrav»-oppdraget.                                                                                                            | VM-image, profil, datadisk og subscription er eksplisitte oppdragskrav. Se forberedelsen under.                                                                                         |
| 9    | Åpne den ufullførte Small-innleveringen og deretter den senere Standard-innleveringen. Åpne original kvittering.                                                                         | Teknisk opprettelse kan lykkes samtidig som et oppdragskrav avviker. Small→Standard vises konkret; første resultat beholdes. Ingen faktisk oppstart, trafikk eller ytelse er bekreftet. |
| 10   | Retur til riktig kurs → Kursoversikt → Knowledge Journal. Gjenåpne en relevant aktivitet og reload.                                                                                      | Lagret kontekst og resultater er fortsatt tilgjengelige. Journal og tidligere feedback følger undervisnings-/assistance-grensene.                                                       |

## Forbered VM-delen med faktisk arbeid

For en kort demonstrasjon kan dette utføres på forhånd i **den samme disponible nettleserprofilen**, gjennom ordinære kontroller. Ikke bruk innsprøytet lagring eller hardkodet positiv status.

Start guided infrastructure eksplisitt. Opprett en gruppe i Shared Sandbox og en Ubuntu 22.04-VM med **Small**, ekstra **32 GiB** datadisk og støttet nettverk. Velg VM-en; inspiser VM, OS-disk, datadisk, NIC, subnet og opprettelseskvittering gjennom oppdragets lenker. Registrer faglig forklaring og lever. Debriefen skal si at VM-en er opprettet, men at profilen avviker fra **Standard**.

«Forbered et nytt guidet forsøk» åpner først briefen. Trykk Start; opprett en ny VM med **Standard**, ellers de samme oppdragskravene. Gjør de nye inspeksjonene og lever. Vis begge resultatene gjennom «Tidligere innleveringer og avbrudd». Det første skal fortsatt vise Small-avviket. Dette er to faktiske guidede forsøk, ikke bevis på selvstendig mestring.

## Avgrens demonstrasjonen

Vis gjerne én original kvittering og én relevant avhengighet i dybden. Ikke gå gjennom alle tekniske detaljer bare fordi de finnes. Et aktivt independent-forsøk kan med hensikt holde undervisning tilbake; bruk et separat disponibelt vindu til slike sikkerhetstester.

Pålitelig lokalt demonstrerbart er de støttede ressursgruppene, Web-plan/app-relasjonen, den avgrensede Web-location-policyen, VM-bundle med avhengigheter og originale receipts. Modeller for kapasitet, økonomi, trafikk, drift, sikkerhetsvurdering og andre tjenester er eksplisitt avgrenset undervisning. Ingen kommando når Azure, og ingen ekte app, VM, varsling eller nettverkstrafikk kjøres.

Faktisk preflight ble gjennomført anonymt 5. november på PR56-basen `a3f1b575b2eb5b257fd455fec1a73b30a38706f4`. Kandidatens nye SHA, komplette CI, streng release og Gate7 føres separat i release-readiness-notatet; baselinebevis er ikke kandidatgodkjenning.
