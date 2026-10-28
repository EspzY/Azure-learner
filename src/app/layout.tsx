import { ManagementProvider } from '@/features/learning/management-provider';
import { TransferProvider } from '@/features/learning/transfer-provider';
import { ComputeProvider } from '@/features/learning/compute-provider';
import { CostProvider } from '@/features/learning/cost-provider';
import { MissionProvider } from '@/features/course/mission-provider';
import { PhysicalProvider } from '@/features/learning/physical-provider';
import { SaasProvider } from '@/features/portal/saas-provider';
import { PracticalProvider } from '@/features/course/practical-provider';
import { SandboxProvider } from '@/features/portal/sandbox-provider';
import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { ProgressProvider } from '@/components/progress-provider';
import { nb } from '@/content/nb';
import { LearningProvider } from '@/features/learning/provider';
import { PortalLearningProvider } from '@/features/portal/learning-provider';
import { FoundationsV2Provider } from '@/features/learning/v2-provider';
import { CourseProvider } from '@/features/course/provider';
import { ExpansionProvider } from '@/features/learning/expansion-provider';
import { ServerlessProvider } from '@/features/learning/serverless-provider';
import '@xyflow/react/dist/style.css';
import './globals.css';

export const metadata: Metadata = {
  title: nb.metadata.title,
  description: nb.metadata.description,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <ProgressProvider>
          <ComputeProvider>
            <CostProvider>
              <TransferProvider>
                <MissionProvider>
                  <ManagementProvider>
                    <PortalLearningProvider>
                      <FoundationsV2Provider>
                        <CourseProvider>
                          <ExpansionProvider>
                            <SandboxProvider>
                              <SaasProvider>
                                <PracticalProvider>
                                  <ServerlessProvider>
                                    <PhysicalProvider>
                                      <LearningProvider>
                                        <AppShell>{children}</AppShell>
                                      </LearningProvider>
                                    </PhysicalProvider>
                                  </ServerlessProvider>
                                </PracticalProvider>
                              </SaasProvider>
                            </SandboxProvider>
                          </ExpansionProvider>
                        </CourseProvider>
                      </FoundationsV2Provider>
                    </PortalLearningProvider>
                  </ManagementProvider>
                </MissionProvider>
              </TransferProvider>
            </CostProvider>
          </ComputeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
