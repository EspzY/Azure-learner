export const laboratoryFirewallNb = {
  firewalls: 'Azure Firewalls',
  policies: 'Firewall Policies',
  publicIps: 'Public IP addresses',
  analysis: 'Network Policy Analysis',
  boundary:
    'Avgrenset Standard Firewall-konfigurasjon i lokal simulator. Ingen Azure-provisioning, internettilgang, NAT eller trafikk utføres.',
  policyNote:
    'Bare egendefinerte Network Rule Collections støttes. Handlingen gjelder hele collectionen. Ingen application rules, DNAT, arv eller threat intelligence evalueres.',
  privateNote:
    'Privat IP velges med simulatorens deterministiske første-ledige-regel. Dette er ikke en faktisk Azure-IP-allokering.',
  publicNote:
    'Standard, Regional, Static IPv4-konfigurasjon opprettes atomisk sammen med Firewall. Ingen offentlig adresse tildeles, og dette gir ikke internettilgang.',
  routeNote:
    'VirtualAppliance peker til en faktisk modellert Firewall og dens private IP. Prefix matching velger ruten; en valgt rute bekrefter ikke kommunikasjon.',
  peerNote:
    'Allow forwarded traffic gjelder mottak fra det eksterne VNet-et. Endringen gjelder denne retningen alene og oppretter ingen rute eller transitiv peering.',
  legacy:
    'Firewall Part A krever et nytt, separat 3.5-arbeidsområde. Dette arbeidsområdets modell og historikk endres ikke automatisk.',
  newWorkspaceNote:
    'Start et separat 3.5-arbeidsområde med Storage, Networking, Compute og Firewall. Det gamle arbeidsområdet og originalhistorikken beholdes; ingen kursdata importeres.',
  nameNote:
    'Firewall-navn: 1–50 ASCII-bokstaver/tall, punktum, bindestrek eller understrek; start med bokstav/tall og avslutt med bokstav/tall eller understrek.',
  subnetNote:
    'Vanlige subnett: kanonisk /8–/29 innen VNet uten overlapp. AzureFirewallSubnet må ha nøyaktig dette navnet og /26 eller større. Andre reserverte tjenestesubnett er ikke støttet.',
  unallocated: 'Ingen faktisk adresse tildelt',
  unassessed: 'Ikke vurdert / uavklart',
  pathDetails: 'Rute- og returgrunnlag',
  matchedRule: 'Første terminerende Firewall-match',
  decisiveNsg: 'Avgjørende NSG-regel',
  groupPriority: 'Group / priority',
  collectionPriority: 'Collection / priority / action',
  ruleLabel: 'Rule',
  matchLabel: 'Match',
  yes: 'Ja',
  no: 'Nei',
  groups: 'Rule Collection Groups',
  collections: 'Network Rule Collections',
  rules: 'Network Rules',
  operations: {
    CreateFirewallPolicy: 'Create Firewall Policy',
    CreateFirewallRuleCollectionGroup: 'Add rule collection group',
    CreateFirewallNetworkCollection: 'Add network rule collection',
    CreateFirewallNetworkRule: 'Add network rule',
    CreateAzureFirewall: 'Create Azure Firewall',
    CreateFirewallRoute: 'Add Firewall route',
    SetPeeringForwardedTraffic: 'Configure forwarded traffic',
    DeleteRoute: 'Delete route',
  },
  fields: {
    policyId: 'Firewall Policy',
    collectionGroupId: 'Rule Collection Group',
    collectionId: 'Network Rule Collection',
    firewallId: 'Azure Firewall',
    publicIpId: 'Public IP configuration',
    peeringId: 'Retningsbestemt peering',
    routeId: 'Route',
    nextHopIp: 'Next-hop IPv4',
    value: 'Allow forwarded traffic',
    tier: 'Policy tier',
    threatIntelMode: 'Threat intelligence',
    skuName: 'Firewall deployment',
    skuTier: 'Firewall tier',
    action: 'Collection action',
    allowForwardedTraffic: 'Allow forwarded traffic',
    forwardingOrigin: 'Forwarded traffic Apply receipt',
  },
  priorityNote:
    'Group- og collection-prioritet er 100–65000. Lavere tall behandles først. Prioriteter er entydige innen samme parent i denne profilen.',
  codes: {
    'invalid-priority': 'Bruk et heltall fra 100 til 65000 for group eller collection.',
    'priority-conflict':
      'Denne parenten har allerede en group eller collection med samme prioritet.',

    'invalid-firewall-subnet':
      'Bruk et dedikert AzureFirewallSubnet med /26 eller større adresserom, uten NIC, NSG eller Route Table.',
    'dedicated-subnet':
      'AzureFirewallSubnet er reservert for Firewall. Vanlige NIC-er, VM-er, NSG og Route Table støttes ikke her.',
    'invalid-next-hop': 'Next-hop IP må være den valgte Firewall-instansens faktiske private IP.',
    'invalid-firewall-rule':
      'Bruk IPv4/CIDR eller *, TCP/UDP og én destinasjonsport 1–65535 eller *.',
    'incompatible-association':
      'Valgte ressurser har ikke kompatibelt scope, region eller direkte hub-peering i denne profilen.',
  },
  outcome: {
    'allowed-via-firewall': 'Den modellerte konfigurasjonsveien via Firewall er tillatt',
    'denied-by-firewall': 'Firewall Policy avviser forespørselen',
    'denied-by-nsg': 'En NSG avviser forespørselen',
    'routing-drop': 'Modellert ruting dropper forespørselen',
    'bypasses-firewall': 'Rutevalget går utenom Firewall',
    incomplete: 'Trafikkveien er ufullstendig eller uavklart',
  },
  nextHop: 'Kilde → next-hop-IP',
  returnNextHop: 'Retur → next-hop-IP',
  reasons: {
    'firewall-next-hop-not-direct':
      'Next-hop-IP-en har ikke et entydig, direkte valgt peeringgrunnlag til riktig Firewall-hub i denne profilen. Inventar-ID-en kan ikke løse IP-tvetydigheten. Full Azure next-hop-oppløsning er ikke modellert.',
    'return-firewall-next-hop-not-direct':
      'Returens next-hop-IP kan ikke knyttes entydig til riktig Firewall-hub i den støttede profilen. Returveien blir derfor uavklart.',
    'modeled-configuration-path-assessed':
      'Forward-rute, Firewall Policy, relevante NSG-lag og returkonfigurasjon er vurdert i denne avgrensede modellen.',
    'source-route-none': 'Kildens valgte rute har next hop None. Ingen Firewall blir nådd.',
    'route-bypasses-firewall':
      'Den valgte ruten bruker ikke VirtualAppliance. Dette er ingen bekreftelse på sentral inspeksjon.',
    'destination-forwarding-disabled':
      'Destinasjonens mottakende spoke-peering mot hub må tillate forwarded traffic. Hub-sidens innstilling erstatter ikke denne.',
    'source-forwarding-disabled':
      'Mottakende peering fra kilde-spoke til hub tillater ikke den modellerte returveien.',
    'return-route-not-same-firewall':
      'Destinasjonens valgte returrute går ikke via samme Firewall. Enveis ruting er ikke nok.',
    'firewall-default-deny':
      'Ingen støttet Network Rule tillater denne forespørselen. Den avgrensede network-only-policyen avviser som standard.',
    'firewall-denied': 'En matchende regel i en Deny-collection stopper evalueringen.',
    'nsg-denied':
      'En konkret NSG-regel blokkerer selv om andre deler av konfigurasjonen kan tillate.',
    'nsg-undetermined': 'En relevant NSG-regel eller service tag kan ikke avgjøres sikkert.',
    'onward-endpoint-mismatch':
      'Hubens valgte videre rute peker ikke til destinasjons-NIC-ens faktiske VNet.',
    'hub-return-endpoint-mismatch':
      'Hubens valgte returrute peker ikke til kilde-NIC-ens faktiske VNet.',
    'onward-route-none': 'Hubens valgte videre rute har next hop None.',
    'unsupported-firewall-topology':
      'Denne inspeksjonen støtter to ulike, direkte hub-peerte spokes i samme region og subscription.',
    'unsupported-firewall-scope':
      'Endepunktene og Firewall ligger utenfor denne profilens støttede scope/region.',
  },
  unknown: 'Modellen har ikke tilstrekkelig verifiserbart grunnlag for denne trafikkveien.',
  result: 'Firewall-inspeksjon',
  trace: 'Network Rule-evaluering',
  forward: 'Kilde → Firewall',
  onward: 'Firewall → destinasjon',
  back: 'Destinasjon → Firewall',
  hubBack: 'Firewall → kilde',
  noTraffic:
    'Ingen pakker er sendt, ingen VM er startet og ingen TCP-handshake er bekreftet. Positivt policyresultat betyr ikke at en applikasjon svarer.',
  returnNote:
    'Returruting kontrolleres mot samme Firewall. Azure har stateful responsbehandling; analysen oppretter ingen flow state og krever ikke en ny, omvendt Allow-regel for en respons.',
  assessed: 'Hele den støttede konfigurasjonsveien er vurdert',
  incomplete: 'Hele konfigurasjonsveien er ikke bekreftet',
} as const;
