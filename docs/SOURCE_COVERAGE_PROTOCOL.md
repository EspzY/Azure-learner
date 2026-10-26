# Source coverage protocol

Aktiv Gate1 og [QUALITY_CONTRACT B](QUALITY_CONTRACT.md). Kildekartlegging gjøres før manuskript-/presentasjonsarbeid. En gammel source-register-lenke er utgangspunkt, ikke bekreftelse på ny faglig dekning.

## Scope og discovery

1. Fastslå gjeldende study guide/versjon og scoped kompetansepunkter. Gjenbruk den daterte PR19-auditen, men sjekk oppdateringer når nye fagområder implementeres.
2. Kartlegg offisielle stier, alle relevante moduler og offentlige enhetssider innen det avgrensede området. Noter faktisk enhetsstruktur, forkunnskaper og ekspanderbare seksjoner.
3. Følg relevante lenkede tillegg, videre lesning, forutsetninger og tekniske referanser. Klassifiser hvert funn som reviewed-essential, reviewed-applied, optional, outside-scope eller blocked; begrunn avgrensningen. Ikke følg hele internett rekursivt.
4. Kontroller fagpåstandene mot aktuell produkt-/arkitekturdokumentasjon og offisielle eksempler. Ved uenighet: dokumenter versjon, kontekst, tjeneste-/planforskjell og eventuell usikkerhet.
5. Registrer demonstrasjoner/sandbox som tilgjengelig, blokkert eller bare dokumentert. Ikke godkjenn en faktisk sandbox-interaksjon fra en videolink eller et metadataresultat.

## Source-record

Release-recordet har for hver scoped kilde: stabil ID, URL, dokumenttittel, type i hierarkiet, reviewdato, synlig versjon eller rolling-page/kontrolldato, availability (`AVAILABLE`, `BLOCKED`, `UNVERIFIED`), konkrete kompetanse-ID-er, kontrollerte claim-ID-er/tekst og vesentlige grenser. Discovery-loggen inneholder relevante underlenker og disposition/begrunnelse. Oppgi `not-applicable` med reell scopegrunn der et hierarkinivå ikke er relevant, fremfor å fabrikkere en modulgransking.

En claim som støttes bare av BLOCKED/UNVERIFIED-kilder kan ikke passere source-integrity. Finn offisielt tilgjengelig alternativ eller la det faglige kravet stå uavklart. En blocked referanse kan beholdes ærlig i registeret. Automatisk URL-/filkontroll er ikke fakta- eller fullstendighetskontroll.

## PR20s avgrensede gjennomgang

Ingen ny module/unit-/AZ-900-audit er utført. PR19 brukes for kompetansegrunnlaget. Nye originale SavvyShark-forklaringer er avgrenset til eksisterende custom Web-deny og modellert VM→OS-disk/NIC→subnet→VNet. Offentlig [Policy overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview), [managed disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview) og [VM network relationships](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview) ble lest 2026-10-26. Bare aktuelle relasjons-/deny-påstander brukes; IP-defaults, availability- og ytelsestall er ikke godskrevet eller implementert.

Policy-siden beskriver også mer omfattende og identity-aware egenskaper. Vår lokale rule er eksplisitt smal; den skal ikke brukes til universelle påstander om alle Azure Policy-mekanismer eller RBAC. NIC-assosiasjon er ikke målt trafikk, og lokal VM-konfigurasjon er ikke OS-oppstart. Ingen ny deployment eller tjeneste er modellert.

Den forsøkte eldre exam-duration-URL-en var utilgjengelig. [Offisiell exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience) og [prepare exam](https://learn.microsoft.com/en-us/credentials/certifications/prepare-exam) beskriver offentlige formater og lenker til sandbox. `aka.ms/examdemo` ble avvist av research-verktøyets redirect-tilgang. Den offisielle engelske lenken fra Learn åpnet demoens introduksjon i nettleseren; videre bruk møtte Candidate Agreement og ble stoppet uten aksept. Selve oppgaveformatene er derfor ikke registrert som interaktivt gjennomgått. Ingen Candidate Agreement eller beskyttelse ble omgått. Single/multiple choice, matching, drag-and-drop/ordering, case og tekniske beslutninger forblir planlagte motorformater, ikke eksakte AZ-900-formatløfter eller kopierte spørsmål.

Kilder/kontrollerte påstander og tilgjengelighetsgrenser finnes maskinlesbart i [current release](../quality/releases/current.json). Kvalifisert menneskelig SME-review er ikke gjennomført.
