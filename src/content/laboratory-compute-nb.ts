export const laboratoryComputeNb = {
  vms: 'Virtual machines',
  disks: 'Managed disks',
  vm: 'Virtual machine',
  disk: 'Managed OS disk',
  create: 'Create virtual machine',
  boundary:
    'Simulert VM-konfigurasjon. Ingen VM startes, og ingen operativsystemer, passord eller reelle blokkdata opprettes.',
  nicBoundary:
    'Én primær, statisk privat IPv4-konfigurasjon. Eventuell VM-tilknytning vises som modellert konfigurasjon; ingen VM-runtime, MAC-adresse eller faktisk trafikk simuleres.',
  network: 'Networking',
  image: 'OS-image',
  size: 'VM-size',
  osDiskSku: 'OS-diskprofil',
  osDiskSizeGiB: 'OS-diskstørrelse (GiB)',
  nicName: 'NIC-navn',
  osDiskName: 'OS-disknavn',
  childNote:
    'Én ny primær NIC og én OS-disk opprettes sammen med VM-en. Navnene avledes fra VM-navnet.',
  nameNote:
    'Bokstaver, tall og bindestrek; start og slutt med bokstav eller tall. Maks. 64 tegn for Linux og 15 for Windows.',
  staticNote:
    'Eksplisitt statisk privat IPv4. Adressen må være ledig og utenfor subnettets reserverte adresser.',
  none: 'Ingen NIC-NSG',
  ownership: 'Tilknyttet VM',
  configuration: 'Simulert konfigurasjon',
  architecture: 'Arkitektur',
  generation: 'Hyper-V-generasjon',
  imageReference: 'Symbolsk image-referanse',
  imageNote:
    'Frosset konfigurasjonsutvalg; ingen image lastes ned. Regional SKU-kapasitet og kvote kontrolleres ikke.',
  route: 'Analyser rute fra VM-ens NIC',
  policy: 'Analyser NSG-policy fra VM-ens NIC',
  analysisNote:
    'Rute og policy beskriver bare modellerte nettverksregler. VM-runtime og applikasjonssvar evalueres ikke.',
  legacy:
    'Compute er tilgjengelig i et nytt3.4-arbeidsområde. Nåværende arbeidsområde oppgraderes ikke.',
  newWorkspace: 'Nytt Compute-arbeidsområde',
  newWorkspaceNote:
    'Starter en separat3.4-sesjon. Eksisterende arbeidsområder og historiske kvitteringer beholdes på serveren. Ingen ressurser kopieres.',
  fields: {
    osDiskId: 'Managed OS disk',
    sizeGiB: 'Diskstørrelse (GiB)',
    osType: 'OS-type',
    image: 'OS-image',
    size: 'VM-size',
    osDiskSku: 'OS-diskprofil',
    osDiskSizeGiB: 'OS-diskstørrelse (GiB)',
    nicName: 'NIC-navn',
    osDiskName: 'OS-disknavn',
  },
} as const;
