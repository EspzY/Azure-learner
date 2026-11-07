export const laboratoryEndpointsNb = {
  nics: 'Network interfaces',
  nic: 'Network interface',
  analysis: 'NSG Policy Analysis',
  newWorkspace: 'Start separat 3.3-arbeidsområde',
  newWorkspaceNote:
    'Et nytt, separat arbeidsområde støtter Storage og Networking A/B/C. Det eksisterende arbeidsområdet og alle originale hendelser beholdes uten oppgradering. Andre faner må laste inn den nye sesjonen.',
  legacy:
    'Denne arbeidsområdemodellen har ikke NIC og policyanalyse. Historikken beholdes. Et nytt 3.3-arbeidsområde må startes eksplisitt.',
  boundary:
    'Én statisk, privat IPv4-konfigurasjon per NIC. Ingen VM, MAC-adresse eller faktisk trafikk er simulert.',
  analysisNote:
    'Skrivebeskyttet analyse av en hypotetisk ny TCP-/UDP-forbindelsesinitiering mellom to modellerte NIC-er. Ingen pakker sendes; applikasjon, returtrafikk og etablert forbindelsestilstand evalueres ikke.',
  defaultNote:
    'Standardreglene er faste. VirtualNetwork kan bare bekreftes for modellerte lokale og direkte tilknyttede peer-nett. Andre taggtilfeller, Internet og AzureLoadBalancer gir uavklart der de avgjør regelmatchen.',
  usable: 'Mulige adresser etter Azure-reservasjonene',
  ipNote: 'Velg en ledig adresse i subnettet. De fire første og den siste adressen er reservert.',
  nameNote:
    '1–80 tegn: bokstaver, tall, punktum, bindestrek og understrek. Start med bokstav/tall; avslutt med bokstav/tall/understrek.',
  associationNote:
    'NIC og NSG må ha samme region og abonnement. Apply lagrer eller erstatter tilknytningen; frakobling krever en egen Apply.',
  associationError: 'NIC, VNet og eventuell NSG må ha kompatibel region og samme abonnement.',
  noAssociation: 'NIC-en har ingen NSG å koble fra.',
  operations: {
    CreateNetworkInterface: 'Opprett network interface',
    AssociateNicNsg: 'Knytt NSG til NIC',
    DisassociateNicNsg: 'Koble NSG fra NIC',
  },
  fields: {
    nicId: 'Network interface',
    privateIpAddress: 'Privat IPv4-adresse',
    allocation: 'IP-allokering',
    ipVersion: 'IP-versjon',
    primary: 'Primær IP-konfigurasjon',
  },
  codes: {
    'invalid-private-ip': 'Angi en gyldig IPv4-adresse uten innledende nuller.',
    'outside-subnet': 'IP-adressen ligger utenfor det valgte subnettet.',
    'reserved-private-ip': 'IP-adressen er reservert av Azure i dette subnettet.',
    'duplicate-private-ip': 'En annen NIC i subnettet bruker allerede denne IP-adressen.',
    'invalid-source-nic': 'Velg en eksisterende kilde-NIC.',
    'invalid-destination-nic': 'Velg en eksisterende destinasjons-NIC.',
    'unsupported-protocol': 'Analysen støtter bare TCP og UDP.',
    'invalid-port': 'Angi én port fra 0 til 65535, uten innledende nuller.',
  },
  source: 'Kilde-NIC',
  destination: 'Destinasjons-NIC',
  protocol: 'Protokoll',
  sourcePort: 'Kildeport',
  destinationPort: 'Destinasjonsport',
  calculate: 'Analyser nettverkspolicy',
  result: 'Modellert policyutfall',
  stale: 'Arbeidsområdet er endret. Beregn analysen på nytt for gjeldende revisjon.',
  statuses: {
    'allowed-by-modeled-network-policy': 'Tillatt av modellert nettverkspolicy',
    'denied-by-modeled-network-policy': 'Avvist av modellert nettverkspolicy',
    'dropped-by-modeled-routing': 'Droppet av modellert ruting',
    undetermined: 'Uavklart / ikke støttet',
  },
  reasons: {
    'all-layers-allow':
      'Alle relevante modellerte NSG-lag tillater initieringen eller har ingen NSG tilknyttet.',
    'denied-rule':
      'En konkret matchende NSG-regel avviser initieringen. Senere lag evalueres ikke.',
    'unknown-rule':
      'En tidligere regel kan ikke avgjøres sikkert. Senere regler eller lag brukes ikke som et oppdiktet svar.',
    'route-none': 'Den valgte ruten har next hop None. NSG-lagene evalueres ikke.',
    'route-undetermined': 'Ruteanalysen kan ikke avgjøre en støttet vei.',
    'unsupported-path':
      'Valgt rute dokumenterer ikke en støttet lokal eller direkte peering-vei til destinasjons-NIC-en.',
    'self-endpoint-unsupported':
      'Samme NIC som kilde og destinasjon krever lokal vertsatferd som ikke er modellert.',
  },
  layers: {
    'source-nic-outbound': '1 · Kilde-NIC · outbound',
    'source-subnet-outbound': '2 · Kildesubnett · outbound',
    'destination-subnet-inbound': '3 · Destinasjonssubnett · inbound',
    'destination-nic-inbound': '4 · Destinasjons-NIC · inbound',
  },
  layerStatus: {
    allow: 'Tillater',
    deny: 'Avviser',
    undetermined: 'Uavklart',
    'not-associated': 'Ingen NSG tilknyttet',
    'not-evaluated': 'Ikke evaluert',
  },
  matches: {
    match: 'Match',
    'no-match': 'Ingen match',
    unknown: 'Uavklart',
    'not-evaluated': 'Ikke evaluert',
  },
  checks: {
    'literal-match': 'Verdien matcher.',
    'literal-mismatch': 'Verdien matcher ikke.',
    'known-virtual-network-member':
      'IP-en tilhører et kjent lokalt eller direkte tilknyttet peering-nett.',
    'virtual-network-tag-incomplete':
      'IP-en er ikke bekreftet innenfor den modellerte delen av VirtualNetwork-taggen.',
    'internet-tag-unsupported': 'Internet-taggen kan ikke avgjøres av denne modellen.',
    'platform-probe-unsupported': 'Plattformens lastbalanseringsprober er ikke modellert.',
    'expression-unsupported': 'Uttrykket støttes ikke av analysen.',
  },
} as const;
