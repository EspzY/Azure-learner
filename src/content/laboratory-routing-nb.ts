export const laboratoryRoutingNb = {
  tables: 'Route tables',
  table: 'Route table',
  peerings: 'Peerings',
  peering: 'VNet peering',
  routes: 'Routes',
  route: 'User-defined route',
  analysis: 'Ruteanalyse',
  analyse: 'Beregn rute',
  source: 'Kildesubnett',
  destination: 'Destinasjons-IP',
  boundary:
    'Konfigurasjon og rutevalg i lokal simulator. Trafikk, NSG-evaluering og ende-til-ende-forbindelse er ikke verifisert.',
  legacy:
    'Dette arbeidsområdet beholder sin opprinnelige modell. Peering og UDR krever et nytt, eksplisitt 3.2-arbeidsområde; ingen data oppgraderes automatisk.',
  peeringNote:
    'Én retning gir Initiated. Opprett motsatt retning for Connected. Peering er ikke transitiv. Gateway transit og forwarded traffic er ikke støttet.',
  routeNote:
    'Støtter Internet, None og et avgrenset Virtual network-valg. Virtual network-prefikset må ligge innenfor hvert tilknyttet VNets adresserom. Ingen gateway, appliance, BGP eller service endpoints.',
  association:
    'Samme region og abonnement som subnettets VNet. Én tabell per subnett; en tabell kan deles av flere kompatible subnett.',
  associationError: 'Route Table og subnettets VNet må ha samme region og abonnement.',
  computed: 'Rute beregnet',
  traffic: 'Trafikk er ikke evaluert. Valgt next hop dokumenterer ikke en fungerende forbindelse.',
  priority:
    'Lengste matchende prefiks velges først. Ved identisk prefiks foretrekkes en UDR fremfor en systemrute. BGP og service-endpoint-unntak ligger utenfor denne modellen.',
  stale: 'Arbeidsområdet er endret. Beregn ruten på nytt for gjeldende revisjon.',
  inactive: 'Peerings uten motsatt retning gir ingen peeringrute:',
  incoming: 'Innkommende peering-referanser',
  newWorkspace: 'Opprett nytt 3.2-arbeidsområde',
  newWorkspaceNote:
    'Det eksisterende arbeidsområdet og dets tekniske historikk bevares. Ny sesjonscookie peker til et nytt, tomt arbeidsområde.',
  fields: {
    remoteVnetId: 'Eksternt VNet',
    routeTableId: 'Route table',
    nextHopType: 'Next hop',
    routeAssociationOrigin: 'Kvittering for rutetabelltilknytning',
    allowVirtualNetworkAccess: 'Tilgang mellom VNets',
  },
  operations: {
    CreateVnetPeering: 'Opprett peering',
    CreateRouteTable: 'Opprett Route Table',
    CreateRoute: 'Opprett route',
    AssociateSubnetRouteTable: 'Tilknytt Route Table',
    DisassociateSubnetRouteTable: 'Fjern Route Table-tilknytning',
  },
  codes: {
    'ambiguous-routes':
      'Flere peeringruter har samme prefiks. Denne tvetydige topologien ligger utenfor den støttede ruteanalysen.',
    'invalid-peering': 'Et VNet kan ikke peeres med seg selv.',
    'overlapping-vnets': 'VNets med overlappende adresserom kan ikke peeres.',
    'duplicate-peering': 'Denne peering-retningen finnes allerede.',
    'duplicate-prefix': 'Tabellen har allerede en route med dette adresseprefikset.',
    'unsupported-next-hop':
      'Denne next-hop-typen støttes ikke. Velg Virtual network, Internet eller None.',
    'unsupported-route-profile':
      'Virtual network-ruten må ligge innenfor adresserommet til alle tilknyttede VNets i denne simulatoren.',
    'not-associated': 'Subnettet har ingen Route Table-tilknytning å fjerne.',
    'invalid-source': 'Velg et eksisterende subnett i dette arbeidsområdet.',
    'invalid-destination': 'Angi én gyldig IPv4-adresse uten prefiks.',
    'unsupported-destination':
      'Denne plattform-, loopback-, link-local-, multicast- eller reserverte destinasjonen er ikke støttet i ruteanalysen.',
    'unsupported-model': 'Ruteanalyse krever et 3.2-arbeidsområde.',
  },
  reasons: {
    selected: 'Lengste matchende prefiks, deretter rutetypeprioritet.',
    'no-match': 'Destinasjonen ligger utenfor prefikset.',
    'shorter-prefix': 'En annen matchende rute har et lengre prefiks.',
    'system-tie': 'Samme prefiks; den brukerdefinerte ruten har prioritet.',
  },
  nextHops: {
    VnetLocal: 'Virtual network',
    VnetPeering: 'VNet peering',
    Internet: 'Internet',
    None: 'None · dropp',
  },
} as const;
