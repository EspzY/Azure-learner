/** Frozen symbolic configuration catalogue, not an Azure image download/SKU availability lookup. */
export const images = [
  {
    id: 'ubuntu-22.04-gen2',
    name: 'Ubuntu Server 22.04 LTS · x64 Gen2',
    osType: 'Linux',
    architecture: 'x64',
    generation: 'V2',
    reference: 'Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest',
  },
  {
    id: 'windows-2022-gen2',
    name: 'Windows Server 2022 Datacenter Azure Edition · x64 Gen2',
    osType: 'Windows',
    architecture: 'x64',
    generation: 'V2',
    reference: 'MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest',
  },
] as const;
export const sizes = [
  { id: 'Standard_D2s_v4', vcpus: 2, memoryGiB: 8, architecture: 'x64' },
  { id: 'Standard_D4s_v4', vcpus: 4, memoryGiB: 16, architecture: 'x64' },
] as const;
export const diskSizes = ['128', '256'] as const;
export const childNames = (name: string) => ({ nic: `${name}-nic`, disk: `${name}-os` });
