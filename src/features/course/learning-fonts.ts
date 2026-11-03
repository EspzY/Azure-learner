import localFont from 'next/font/local';

// Original PR50 SIL OFL files, unchanged. Metric-adjusted local fallbacks prevent
// the reading/UI identity from depending on a third-party font request.
export const learningSans = localFont({
  src: '../../../public/design-review/fonts/manrope.woff2',
  variable: '--learning-sans',
  display: 'swap',
  weight: '400 800',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
export const learningEditorial = localFont({
  src: '../../../public/design-review/fonts/source-serif-4.woff2',
  variable: '--learning-editorial',
  display: 'swap',
  weight: '400 700',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});
