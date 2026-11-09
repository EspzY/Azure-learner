import localFont from 'next/font/local';

// Open Sans is OFL-1.1. Satoshi's FFL prohibits repository redistribution;
// tokens request an installed Satoshi before this honestly documented fallback.
export const bifrostOpenSans = localFont({
  src: '../../../public/design/bifrost/fonts/open-sans-latin-variable.woff2',
  variable: '--bf-open-sans-loaded',
  display: 'swap',
  weight: '300 800',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
