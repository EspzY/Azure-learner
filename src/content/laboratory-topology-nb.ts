export const laboratoryTopologyNb = {
  name: 'Ressursnavn',
  identity: 'Ressurs-ID',
  observationTypes: {
    'route-blocks-modeled-flow': 'Den valgte UDR-en dropper den analyserte initieringen',
    'peering-access-disabled': 'Peering-tilgang er deaktivert i relevant analysegrunnlag',
  },
  routeDrop:
    'Den konkrete brukerdefinerte ruten har next hop None og velges for denne destinasjonen. Undersøk kravet og ruten; ingen generell arkitekturfasit eller sikkerhetsscore er beregnet.',
  peeringAccessObservation:
    'Denne retningen har allowVirtualNetworkAccess=false. Connected-status alene bekrefter ikke tilgang. Se analysens begrensninger for rute, retur og VirtualNetwork-standardregler.',
  editRoute: 'Edit route',
  editPeering: 'Edit virtual network access',
  disassociate: 'Disassociate subnet NSG',
  fields: {
    addressPrefix: 'Destination address prefix',
    nextHopType: 'Next hop type',
    firewallId: 'Azure Firewall',
    nextHopIp: 'Next hop IP address',
    value: 'Allow local virtual network access to remote',
  },
  routeNote:
    'Ruten beholder navn, ID, parent Route Table og original Create-kvittering. Endringen valideres mot alle subnett som bruker tabellen.',
  peeringNote:
    'Endringen gjelder bare denne peering-retningen. Connected-status og Allow forwarded traffic endres ikke. Rutevalg er konfigurert analyse, ikke faktisk trafikk.',
  detachNote:
    'Frakobling fjerner bare denne subnett-tilknytningen. NSG og regler beholdes. Frakobling kan redusere beskyttelsen og er ikke automatisk en forbedring.',
  confirmDetach: 'Bekreft frakobling av NSG fra',
  accessTitle: 'Peering access — modellert forutsetning',
  localVnet: 'Lokalt VNet',
  remoteVnet: 'Eksternt VNet',
  accessLimit:
    'Minst én relevant peering-retning har deaktivert virtuell nettverkstilgang. Konfigurert rutevalg vises fortsatt. Denne profilen kan ikke fastslå hele trafikkveien eller VirtualNetwork-standardreglenes betydning etter endringen; ingen Allow/Deny eller faktisk forbindelse bekreftes.',
  accessEnabled:
    'Tilgang er aktivert på de undersøkte peering-retningene. Dette erstatter ikke kontroll av forwarding, returvei, NSG eller Firewall Policy.',
  noChange: 'Ingen støttede konfigurasjonsverdier er endret.',
  newWorkspace: 'Åpne nytt Laboratory3.7-arbeidsområde',
  newWorkspaceNote:
    'Opprett et separat, tomt arbeidsområde med Topology Remediation. Det eksisterende arbeidsområdet oppgraderes ikke, og ressurser eller kursdata overføres ikke.',
  legacy:
    'Dette arbeidsområdet beholder sin opprinnelige modell. Topology Remediation er tilgjengelig i et separat, nytt3.7-arbeidsområde.',
  missingHistorical: 'Ressursen finnes ikke ved dette historiske tidspunktet.',
  operations: {
    UpdateRoute: 'Update route',
    DisassociateSubnetNsg: 'Disassociate subnet NSG',
    SetPeeringVirtualNetworkAccess: 'Set peering virtual network access',
  },
} as const;
