export const portalWorkspaceNb = {
  free: 'Fri Laboratory',
  course: 'Kursarbeidsområde',
  modeNote:
    'Lokal AzureLab-simulator · eget serverlagret arbeidsområde · ingen kursresultater eller XP',
  scopeNote:
    'Samme AzureLab Portal, separate arbeidsområder. Kursenes eksisterende ressurser og historikk forblir i kursarbeidsområdet.',
  createNote: 'Kontroller konfigurasjonen med Review. Bare Create eller Apply lagrer en operasjon.',
  reviewAccepted: 'Konfigurasjonen er validert. Bare Create eller Apply lagrer endringen.',
  searchObjects: 'Ressurser og objekter i arbeidsområdet',
  search: 'Search resources and services',
  accepted: 'Akseptert',
  denied: 'Avvist',
  localScope: 'Lokalt simulator-scope',
  menuNote: 'Støttede tjenester i dette arbeidsområdet',
  resourceKinds: {
    group: 'Resource group',
    account: 'Storage account',
    container: 'Private container',
    blob: 'Text blob',
    vnet: 'Virtual network',
    subnet: 'Subnet',
    nsg: 'Network security group',
    rule: 'Security rule',
    peering: 'VNet peering',
    routeTable: 'Route table',
    route: 'User-defined route',
  },
} as const;
