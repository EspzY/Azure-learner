/** Interface orientation only; existing manuscripts and assessment copies stay unchanged. */
export const journeyNb = {
  catalogNote:
    'Faggruppene er et oppslagskart. Start/Fortsett og Neste følger en anbefalt læringsreise på tvers av stiene.',
  catalogAccess: 'Åpne et tema direkte, eller bruk Neste for den anbefalte reisen.',
  closing: 'Avsluttende anvendelse',
  context: 'Anbefalt læringsreise',
  next: 'Videre i læringsreisen',
  finish: 'Siste modul i den anbefalte reisen',
  open: 'Åpne kursoversikten',
  sandbox: 'Utforsk Sandbox videre',
  introductions: {
    security:
      'Avsluttende tverrfaglig anvendelse: identitet, nettverk, lagring, styring og overvåking samles i en sikkerhetsarkitektur. Anbefales etter Monitoring. Du kan også åpne delen direkte.',
    migration:
      'Avsluttende tverrfaglig anvendelse: planlegg flytting med grunnlag i Storage, Networking, Identity og Management Tools. Delen avslutter den anbefalte reisen, men kan også åpnes direkte.',
  },
  transitions: {
    'storage-resilience':
      'Før vi senere planlegger flytting av data, undersøker vi hvem som får bruke dem. Neste del handler om identiteter og autentisering; deretter følger tilgangsstyring.',
    'access-control':
      'Fra hvem som kan gjøre hva, går reisen videre til hva miljøet koster og hvordan det styres og administreres.',
    monitoring:
      'Signaler om konfigurasjon, helse og hendelser gir grunnlag for en helhetlig sikkerhetsvurdering. Neste del samler prinsipper og kontroller fra flere fagområder.',
    security:
      'Neste steg er avsluttende planlegging: hvordan eksisterende data og arbeidslaster kan flyttes, og hvordan resultatet skal valideres.',
    migration:
      'Bruk kursoversikten og Knowledge Journal til repetisjon, eller utforsk Sandbox videre. Å komme hit dokumenterer ikke mestring eller eksamensberedskap.',
  },
} as const;
