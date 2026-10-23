import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { ProgressProvider } from '@/components/progress-provider';
import { nb } from '@/content/nb';
import { ExpeditionProvider } from '@/features/journey/expedition-provider';
import { ChapterProvider } from '@/features/chapter01/provider';
import { GameProvider } from '@/features/rpg/game-provider';
import { LearningProvider } from '@/features/learning/provider';
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
                  <AppShell>{children}</AppShell>
                </LearningProvider>
              </GameProvider>
            </ChapterProvider>
          </ExpeditionProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
