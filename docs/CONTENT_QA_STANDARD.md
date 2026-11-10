# Content QA standard

Operasjonell støtte til [QUALITY_CONTRACT A/C/D](QUALITY_CONTRACT.md) og eksisterende [CONTENT_STANDARDS](CONTENT_STANDARDS.md). Det er én standard, ikke et nytt konkurrerende curriculum-system. PR19s A–F-matrise beholdes uendret som datert audit; PR20 utfører ikke ny eksamensanalyse og implementerer ikke serverless eller nye moduler.

## Før implementering

Definer scope, stabile lokale kompetansemål og versjonert sertifiseringsoverlay. Les faktisk eksisterende manuskript/aktivitet/rubric og dokumenter gjenbruk versus gap. Utfør kildeprotokollen før originalt manuskript. For hvert nytt modulmål må release-recordet peke på:

1. Forkunnskaper og introduserte termer.
2. Konseptforklaring, hensikt og bruksvilkår.
3. Teknisk mekanisme, relasjoner og avhengigheter.
4. Azure-spesifikt eksempel og worked example.
5. Grenser, misforståelse og moteksempel.
6. Visualisering/praksis, forventet observasjon og tilgjengelig alternativ.
7. Registrert uavhengig nytt scenario og kilde-/rubricbinding.
8. Rationale for riktig og hvert plausibelt galt svar.
9. Kilde-/påstandskart og reviewdato.

Eksisterende `nb.ts`-manuskripter, manifests, A–F-audit, content-integrity- og deterministiske assessment-tester er autoritative. Nye fagmål skal inn i relevante eksisterende registre, ikke bare i release-JSON. En release-peker beviser tilstedeværelse, ikke at forklaringen er god nok. Ordmengde skal ikke brukes som godkjenningskriterium.

## Under implementering

Teori før handling; forklar alle tall og enheter. Behold skillet mellom demonstrasjon, guided practice, first unaided, hjelp og retry. Vis årsak og faktisk konsekvens fra den relevante modellen. Ingen ny indikator eller popup kan fullføre et mål. Bevar hele tidligere manuskript når presentasjonen endres; repliker ikke inventory eller assessment state.

## Etter implementering

Utfør Gate6 etter at innhold og UI virker ferdig. Reviewer skal faktisk lese sentrale forklaringer og oppgaver, undersøke minst ett galt og ett riktig svar, se modelldata/negative regler og inspisere browserbilder. Let etter ledende ordlyd, implisitte forkunnskaper, irrelevante distraktorer, røpet prediksjon og ufullstendig alternativfeedback. Kontroller at debrief beskriver faktisk aktivitet.

Tidligere PARTIAL-funn, eksempelvis Benefits-diagnose og current-v2 SaaS-valg i PR19, forblir åpne. Et infrastruktur-/guidance-PR må dokumentere dem som uendret, ikke finne opp nye «godkjente» vurderinger. Kvalifisert SME/novice/IT-/accessibility-review må navngis og dokumenteres hvis utført; ellers skal status være utestående.

## Maskinell kontroll

`quality:check` sjekker påstands-/mål-/kilde- og fil-/symbolreferanser, nye modulers obligatoriske lag, alternative tekst-/vurderingspekere og ærlige review-statuser. `curriculum:check` validerer faktisk registrert læringsinnhold og utfører relevante modeller. `quality:release` sjekker at en post-implementation review gjelder de aktuelle endrede filene og ikke har ulukkede blokkere. Ingen av kontrollene beviser menneskelig læring eller psykometrisk kvalitet.
