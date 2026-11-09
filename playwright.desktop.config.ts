import { defineConfig, devices } from '@playwright/test';
import baseline from './playwright.config';

// Exact existing witnesses; collection validation rejects missing/ambiguous
// names. No test body, assertion, title, timeout or skip is modified.
const compactCases = [
  [
    'application-platform.spec.ts',
    'application compact native keyboard focus reduced motion Axe and short desktop keep Review and Properties readable',
  ],
  [
    'portal-consolidation.spec.ts',
    'shared Home subscriptions compact keyboard focus reduced motion Axe and short desktop stay readable in both modes',
  ],
  [
    'ephemeral-landing.spec.ts',
    'compact landing is readable with keyboard access and reduced motion',
  ],
  [
    'laboratory-topology.spec.ts',
    'topology native short desktop Review keyboard focus reduced motion Axe and pinned disassociation preserve actual resource evidence',
  ],
  [
    'laboratory-remediation.spec.ts',
    'remediation compact native Review keyboard focus reduced motion Axe pinned delete and short desktop preserve readable rule evidence',
  ],
  [
    'laboratory-studio.spec.ts',
    'Studio near-capacity graph semantic list keyboard focus reduced motion Axe and short desktop remain usable without moving resource nodes',
  ],
  [
    'laboratory-firewall.spec.ts',
    'firewall compact native Policy Properties Review keyboard focus reduced motion Axe and short desktop keep real controls and evidence readable',
  ],
  [
    'laboratory-compute.spec.ts',
    'compute compact native keyboard Properties networking focus reduced motion Axe and original three-resource receipt remain usable',
  ],
  [
    'laboratory-endpoints.spec.ts',
    'endpoint Laboratory compact native keyboard Properties policy focus reduced motion Axe original receipts and short-height controls remain usable',
  ],
  [
    'laboratory-routing.spec.ts',
    'routing Laboratory compact native analysis keyboard reduced motion Axe properties review and original receipts stay accessible',
  ],
  [
    'shared-portal.spec.ts',
    'shared Portal compact native search drawer properties dialogs reduced motion Axe and unavailable server preserve scope and visible controls',
  ],
  [
    'laboratory-networking.spec.ts',
    'network Laboratory short desktop keyboard focus reduced motion Axe resource forms and reset keep historical receipts accessible',
  ],
  [
    'premium-landing.spec.ts',
    'landing responsive keyboard short desktop status semantics reduced motion and Axe preserve primary choices',
  ],
  [
    'laboratory-server.spec.ts',
    'server Laboratory compact native keyboard short-height reduced motion Axe and actual Blob read remain usable',
  ],
  [
    'vm-debrief.spec.ts',
    'VM diagnostic desktop compact keyboard short-height focus reduced motion and Axe keep diagnosis and next action readable',
  ],
  [
    'challenge-validity.spec.ts',
    'updated Web assessment desktop compact short-height keyboard focus reduced motion and Axe keep complete premises readable',
  ],
  [
    'challenge-return.spec.ts',
    'challenge return desktop compact keyboard short-height reduced motion Axe and original teaching destination stay accessible without evidence writes',
  ],
  [
    'cloud-owner-navigation.spec.ts',
    'closing Cloud Computing choices distinguish voluntary assessment observations and recommended transfer without starting attempts',
  ],
  [
    'cloud-owner-navigation.spec.ts',
    'owner flat Cloud Computing navigation short desktop keyboard reduced motion and Axe expose actual teaching without nested menus or credit',
  ],
  [
    'cloud-consolidation.spec.ts',
    'consolidated chapter desktop compact short-height keyboard reduced motion and Axe keep explanations and controls reachable',
  ],
  [
    'owner-acceptance.spec.ts',
    'owner feedback short desktop keyboard reflow footer clearance Axe and reduced motion preserve readable content',
  ],
  [
    'hybrid-experience.spec.ts',
    'hybrid Container short-window keyboard result discovery uses accepted stored run and marks changed assumptions without technical writes',
  ],
  [
    'hybrid-experience.spec.ts',
    'hybrid desktop compact type keyboard native Journal short-height and reduced motion retain usable real course controls',
  ],
  [
    'visual-excellence.spec.ts',
    'both visual directions preserve native controls Axe semantics and contrast in actual Studio',
  ],
  [
    'application-transfer.spec.ts',
    'native keyboard short-window composition reduced motion and Axe keep transfer controls accessible',
  ],
  [
    'portal-inspection-bridge.spec.ts',
    'Portal inspection desktop compact short-height keyboard focus reduced motion and Axe preserve accessible source and resource navigation',
  ],
  [
    'collapsible-sources.spec.ts',
    'Source desktop compact native keyboard short-height zoom reduced motion and Axe retain readable links and no evidence writes',
  ],
  [
    'assessment-refinement.spec.ts',
    'updated assessment desktop compact short-height keyboard centered start reduced motion and Axe remain usable',
  ],
  [
    'learning-sequencing.spec.ts',
    'Closing journey desktop compact short-height keyboard focus and honest ending remain accessible',
  ],
  [
    'dialog-placement.spec.ts',
    'Portal ordinary modal side panels native briefings and guidance menu retain distinct desktop compact placement',
  ],
  [
    'learning-flow-guidance.spec.ts',
    'Guidance desktop compact keyboard short windows reduced motion and Axe keep recovery and next actions reachable',
  ],
  [
    'file-movement-migration.spec.ts',
    'File Movement desktop and compact keyboard manifest flows short briefing reduced motion Axe and scoped corrupt recovery stay readable',
  ],
  [
    'security-principles.spec.ts',
    'Security desktop and compact keyboard seven layers short briefing reduced motion Axe and scoped corrupt recovery stay readable',
  ],
  [
    'monitoring-diagnostics.spec.ts',
    'Monitoring desktop and compact keyboard short briefing semantic tables reduced motion Axe and scoped corrupt recovery stay readable',
  ],
  [
    'management-tools.spec.ts',
    'Management desktop and compact keyboard, semantic flows, code focus, short native briefing and reduced motion remain readable',
  ],
  [
    'governance-compliance.spec.ts',
    'Governance desktop and compact keyboard, short native briefing, semantic alternatives and reduced motion remain readable',
  ],
  [
    'access-control.spec.ts',
    'Access Control keyboard, semantic flow, short native briefing, reduced motion and compact views remain readable',
  ],
  [
    'identity-foundations.spec.ts',
    'Identity desktop and compact keyboard, semantic flows, reduced motion and short native briefing stay readable',
  ],
  [
    'storage-resilience.spec.ts',
    'Storage B desktop and compact keyboard, hover contrast, semantic maps and short native briefing remain readable',
  ],
  [
    'storage-services.spec.ts',
    'Storage compact briefing, keyboard, reduced motion and semantic controls stay readable across desktop and short views',
  ],
  [
    'course.spec.ts',
    'keyboard, reduced motion, target lifecycle, resize, journal focus and invalid context stay honest',
  ],
  [
    'portal.spec.ts',
    'keyboard search, incomplete practice, reference assistance, first submission and malformed storage are honest',
  ],
  [
    'architecture-physical.spec.ts',
    'example regions, no-pair automatic recovery counterexamples, unknown placement and short keyboard layouts',
  ],
  [
    'cloud-transfer.spec.ts',
    'desktop compositions, short-window briefing, keyboard, reduced motion and Axe retain visible instructions',
  ],
  [
    'compute-hosting.spec.ts',
    'keyboard, Axe, reduced motion and constrained desktop views expose all required instructions',
  ],
  [
    'networking-foundations.spec.ts',
    'keyboard, reduced motion, compact/short desktop and semantic results remain readable',
  ],
  [
    'networking-connectivity.spec.ts',
    'short briefing, keyboard, reduced motion and semantic endpoint stages remain readable across desktop and compact sizes',
  ],
  [
    'serverless.spec.ts',
    'root course → complete serverless teaching, prediction, milestone, independent feedback, Journal and resume',
  ],
  [
    'cost-management.spec.ts',
    'desktop/compact assessment 1024x500, long feedback, keyboard and reduced motion remain readable with no external runtime requests',
  ],
  [
    'cost-management.spec.ts',
    'analysis workbench preserves readable semantic controls in short and existing compact layouts',
  ],
] as const;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Owner-approved distribution. Activation requires an actual complete CI pass;
// the legacy profile remains available and every desktop case is mandatory.
export default defineConfig({
  ...baseline,
  metadata: { ...baseline.metadata, compactCases },
  projects: [
    { ...baseline.projects![0] },
    {
      name: 'compact-chromium',
      grep: new RegExp(compactCases.map(([, title]) => `${escape(title)}$`).join('|')),
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 800, height: 700 },
      },
    },
  ],
});
