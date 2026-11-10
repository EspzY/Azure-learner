/** Public sources reviewed 2026-10-28. Original teaching, no copied assessment. */
export const computeSources = {
  PS01: [
    'Study guide: Skills measured 20 July 2026',
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900',
  ],
  PS02: [
    'Describe Azure compute services: nine units',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/',
  ],
  PS03: [
    'Introduction',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/1-introduction',
  ],
  PS04: [
    'Describe Azure virtual machines',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/2-virtual-machines',
  ],
  PS05: [
    'Describe Azure virtual desktop',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/4-virtual-desktop',
  ],
  PS06: [
    'Describe Azure containers',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/5-containers',
  ],
  PS07: [
    'Describe Azure functions',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/6-functions',
  ],
  PS08: [
    'Describe AI, machine learning, and IoT/Edge services',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/12a-describe-ai-ml-iot-edge-services',
  ],
  PS09: [
    'Describe application hosting options',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/7-describe-application-hosting-options',
  ],
  PS10: [
    'Summary and supplementary App Service module',
    'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/14-summary',
  ],
  PS11: [
    'Azure virtual machines overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/overview',
  ],
  PS12: [
    'Availability options for virtual machines',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/availability',
  ],
  PS13: [
    'Availability sets overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/availability-set-overview',
  ],
  PS14: [
    'Virtual Machine Scale Sets overview',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview',
  ],
  PS15: [
    'Flexible and Uniform orchestration',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes',
  ],
  PS16: [
    'Autoscale with Virtual Machine Scale Sets',
    'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview',
  ],
  PS17: [
    'Azure Virtual Desktop overview',
    'https://learn.microsoft.com/en-us/azure/virtual-desktop/overview',
  ],
  PS18: [
    'Azure Virtual Desktop terminology',
    'https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology',
  ],
  PS19: [
    'Azure Virtual Desktop service architecture',
    'https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience',
  ],
  PS20: [
    'Container Apps overview',
    'https://learn.microsoft.com/en-us/azure/container-apps/overview',
  ],
  PS21: [
    'Introduction to containers on Azure',
    'https://learn.microsoft.com/en-us/azure/container-apps/start-containers',
  ],
  PS22: [
    'Azure Kubernetes Service: Automatic and Standard',
    'https://learn.microsoft.com/en-us/azure/aks/what-is-aks',
  ],
  PS23: [
    'Choose an Azure compute service',
    'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree',
  ],
  PS24: [
    'Containers versus virtual machines',
    'https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm',
  ],
  PS25: [
    'Process and Hyper-V isolation',
    'https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container',
  ],
  PS26: [
    'Azure Container Registry',
    'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro',
  ],
  PS27: [
    'Azure Functions overview',
    'https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview',
  ],
  PS28: [
    'Functions hosting and scale',
    'https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale',
  ],
  PS29: ['App Service overview', 'https://learn.microsoft.com/en-us/azure/app-service/overview'],
  PS30: [
    'App Service plans',
    'https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans',
  ],
  PS31: [
    'Custom containers and persistent storage',
    'https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container',
  ],
  PS32: [
    'Managed disks and disk roles',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview',
  ],
  PS33: [
    'VM network dependencies',
    'https://learn.microsoft.com/en-us/azure/virtual-network/network-overview',
  ],
  PS34: [
    'Shared responsibility',
    'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility',
  ],
  PS35: [
    'Create a VM in the real Portal',
    'https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal',
  ],
  PS36: [
    'Host a web application: supplementary learning',
    'https://learn.microsoft.com/en-us/training/modules/host-a-web-app-with-azure-app-service/',
  ],
  PS37: [
    'Jobs in Azure Container Apps',
    'https://learn.microsoft.com/en-us/azure/container-apps/jobs',
  ],
  PS38: [
    'ACI run-once tasks and restart policies',
    'https://learn.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy',
  ],
} as const;
export const computeBlockedSources = {
  ACI: {
    url: 'https://learn.microsoft.com/en-us/azure/container-instances/container-instances-overview',
    status: 'BLOCKED',
    reason: 'Repeated503; bounded ACI claims verified against PS06 and PS23.',
  },
} as const;
export const computeStudySources = {
  introduction: ['PS01', 'PS02', 'PS03'],
  fundamentals: ['PS11', 'PS23', 'PS34'],
  vm: ['PS04', 'PS11', 'PS32', 'PS34'],
  dependencies: ['PS32', 'PS33', 'PS35'],
  containers: ['PS06', 'PS20', 'PS21', 'PS22', 'PS24', 'PS25', 'PS26', 'PS31', 'PS34'],
  functions: ['PS07', 'PS27', 'PS28', 'PS34'],
  options: ['PS12', 'PS13', 'PS14', 'PS15', 'PS17'],
  resilience: ['PS12', 'PS13', 'PS15', 'PS16'],
  desktop: ['PS05', 'PS17', 'PS18', 'PS19'],
  hosting: ['PS09', 'PS20', 'PS22', 'PS23', 'PS29', 'PS30', 'PS31', 'PS37', 'PS38'],
  context: ['PS08', 'PS10'],
} as const;
