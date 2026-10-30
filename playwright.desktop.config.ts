import { defineConfig, devices } from '@playwright/test';
import baseline from './playwright.config';

// Exact existing witnesses; collection validation rejects missing/ambiguous
// names. No test body, assertion, title, timeout or skip is modified.
const compactCases = [
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

// Opt-in candidate only. The release CI still uses playwright.config.ts until
// the owner approves this distribution; all desktop cases remain mandatory.
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
