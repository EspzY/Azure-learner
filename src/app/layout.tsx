import { SaasProvider } from '@/features/portal/saas-provider';
import { PracticalProvider } from '@/features/course/practical-provider';
import { SandboxProvider } from '@/features/portal/sandbox-provider';
import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { ProgressProvider } from '@/components/progress-provider';
import { nb } from '@/content/nb';
import { ExpeditionProvider } from '@/features/journey/expedition-provider';
import { ChapterProvider } from '@/features/chapter01/provider';
import { GameProvider } from '@/features/rpg/game-provider';
import { LearningProvider } from '@/features/learning/provider';
import { PortalLearningProvider } from '@/features/portal/learning-provider';
import { FoundationsV2Provider } from '@/features/learning/v2-provider';
import { CourseProvider } from '@/features/course/provider';
import { ExpansionProvider } from '@/features/learning/expansion-provider';
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
          <ExpeditionProvider>
            <ChapterProvider>
              <GameProvider>
                <LearningProvider>
                  <PortalLearningProvider>
                    <FoundationsV2Provider>
                      <CourseProvider>
                        <ExpansionProvider>
                          <SandboxProvider>
                            <SaasProvider>
                              <PracticalProvider>
                                <AppShell>{children}</AppShell>
                              </PracticalProvider>
                            </SaasProvider>
                          </SandboxProvider>
                        </ExpansionProvider>
                      </CourseProvider>
                    </FoundationsV2Provider>
                  </PortalLearningProvider>
                </LearningProvider>
              </GameProvider>
            </ChapterProvider>
          </ExpeditionProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
