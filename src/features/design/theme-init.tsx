export const visualThemeKey = 'azurelab.visual-theme.v1';

// Runs in <head> before the first learning-surface paint. The only mutation is
// a visual data attribute; never writes a preference or learner data on load.
export const themeInitScript = `(()=>{let p='system';try{const v=localStorage.getItem('${visualThemeKey}');if(v==='light'||v==='dark'||v==='system')p=v}catch{}const t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;document.documentElement.dataset.bfTheme=t})()`;

export function BifrostThemeInit() {
  return (
    <script id="azurelab-visual-theme" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  );
}
