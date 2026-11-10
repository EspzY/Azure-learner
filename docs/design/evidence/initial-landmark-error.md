# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bifrost-landing.spec.ts >> Bifrost landing light uses the supplied palette with readable whole-card choices at desktop sizes
- Location: tests/e2e/bifrost-landing.spec.ts:22:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 61

- Array []
+ Array [
+   Object {
+     "description": "Ensure all page content is contained by landmarks",
+     "help": "All page content should be contained by landmarks",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.14/region?application=playwright",
+     "id": "region",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "isIframe": false,
+             },
+             "id": "region",
+             "impact": "moderate",
+             "message": "Some page content is not contained by landmarks",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Some page content is not contained by landmarks",
+         "html": "<label for=\"_R_inplb_\">Utseende</label>",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "label",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "isIframe": false,
+             },
+             "id": "region",
+             "impact": "moderate",
+             "message": "Some page content is not contained by landmarks",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Some page content is not contained by landmarks",
+         "html": "<select id=\"_R_inplb_\"><option value=\"system\" selected=\"\">Følg systemet</option><option value=\"light\">Lyst</option><option value=\"dark\">Mørkt</option></select>",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "#_R_inplb_",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "best-practice",
+       "RGAAv4",
+       "RGAA-9.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - link "Gå til kursvalg" [ref=e3] [cursor=pointer]:
            - /url: '#landing-main'
        - generic [ref=e5]:
            - generic [ref=e6]: Utseende
            - combobox "Utseende" [ref=e7] [cursor=pointer]:
                - option "Følg systemet"
                - option "Lyst" [selected]
                - option "Mørkt"
        - main [ref=e8]:
            - region [ref=e9]:
                - heading "AzureLab" [level=1] [ref=e26]
                - paragraph [ref=e27]: Lær Azure. Velg et kurs eller utforsk laboratoriet.
            - region [ref=e28]:
                - heading "Velg ditt kurs" [level=2] [ref=e30]
                - generic [ref=e31]:
                    - article [ref=e32] [cursor=pointer]:
                        - link "Åpne kurset · AZ-900 Azure Fundamentals" [ref=e33]:
                            - /url: /learn
                        - status "AZ-900 er tilgjengelig" [ref=e37]:
                            - generic [ref=e40]: Tilgjengelig
                        - paragraph [ref=e41]: AZ-900
                        - heading "Azure Fundamentals" [level=3] [ref=e42]
                    - article [ref=e45]:
                        - generic [ref=e46]: Planlagt
                        - paragraph [ref=e54]: AZ-104
                        - heading "Azure Administrator" [level=3] [ref=e55]
                    - article [ref=e56]:
                        - generic [ref=e57]: Planlagt
                        - paragraph [ref=e67]: AZ-305
                        - heading "Azure Solutions Architect" [level=3] [ref=e68]
            - region [ref=e69]:
                - generic [ref=e70] [cursor=pointer]:
                    - link "Åpne laboratoriet · AzureLab Laboratory, separat arbeidsområde" [ref=e71]:
                        - /url: /labs/laboratory
                    - generic [ref=e75]:
                        - heading "AzureLab Laboratory" [level=2] [ref=e76]
                        - paragraph [ref=e77]: Utforsk og bygg fritt, adskilt fra kursarbeidet.
        - contentinfo [ref=e80]:
            - paragraph [ref=e81]: Simulert Azure · Ingen skykostnader.
    - alert [ref=e82]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import Axe from '@axe-core/playwright';
  3   | import { landingNb as t } from '../../src/content/nb';
  4   | import { laboratoryEphemeralNb as temporary } from '../../src/content/laboratory-ephemeral-nb';
  5   |
  6   | const visualKey = 'azurelab.visual-theme.v1';
  7   | const appearance = (page: Page) => page.getByRole('combobox', { name: 'Utseende', exact: true });
  8   | const workBytes = (page: Page) =>
  9   |   page.evaluate(
  10  |     (key) =>
  11  |       JSON.stringify(
  12  |         Object.fromEntries(
  13  |           Object.entries(localStorage)
  14  |             .filter(([name]) => name.startsWith('azurelab.') && name !== key)
  15  |             .sort(([a], [b]) => a.localeCompare(b)),
  16  |         ),
  17  |       ),
  18  |     visualKey,
  19  |   );
  20  |
  21  | for (const theme of ['light', 'dark'] as const) {
  22  |   test(`Bifrost landing ${theme} uses the supplied palette with readable whole-card choices at desktop sizes`, async ({
  23  |     page,
  24  |   }, info) => {
  25  |     await page.goto('/');
  26  |     await appearance(page).selectOption(theme);
  27  |     await expect(page.locator('html')).toHaveAttribute('data-bf-theme', theme);
  28  |     await page.evaluate(() => document.fonts.ready);
  29  |     const palette = await page.locator('.azurelab-landing').evaluate((root) => {
  30  |       const css = getComputedStyle(root);
  31  |       return {
  32  |         base: css.getPropertyValue('--bfc-base').trim(),
  33  |         theme: css.getPropertyValue('--bfc-theme').trim(),
  34  |       };
  35  |     });
  36  |     expect(palette).toEqual(
  37  |       theme === 'light'
  38  |         ? { base: '#f3f3f6', theme: '#631cce' }
  39  |         : { base: '#071627', theme: '#ad8aff' },
  40  |     );
  41  |     await expect(page.getByText(t.description, { exact: true })).toBeVisible();
  42  |     await expect(page.locator('.landing-course')).toHaveCount(3);
  43  |     await expect(page.locator('.landing-course-available a')).toHaveCount(1);
  44  |     await expect(page.locator('.landing-laboratory a')).toHaveCount(1);
  45  |     await expect(
  46  |       page.locator(
  47  |         '.landing-course:not(.landing-course-available) a, .landing-course:not(.landing-course-available) button',
  48  |       ),
  49  |     ).toHaveCount(0);
  50  |     await expect(page.locator('.landing-status-complete')).toHaveCount(0);
  51  |     for (const [width, height] of [
  52  |       [1920, 1080],
  53  |       [1440, 900],
  54  |       [1024, 768],
  55  |       [1024, 500],
  56  |       [800, 700],
  57  |     ]) {
  58  |       await page.setViewportSize({ width: width!, height: height! });
  59  |       expect(
  60  |         await page.evaluate(() => ({
  61  |           overflow: document.documentElement.scrollWidth > innerWidth,
  62  |           height: document.documentElement.scrollHeight,
  63  |         })),
  64  |       ).toEqual({ overflow: false, height });
  65  |       await expect(page.getByRole('link', { name: t.az900Link, exact: true })).toBeInViewport();
  66  |       await expect(page.getByRole('link', { name: t.labLink, exact: true })).toBeInViewport();
  67  |       await page.screenshot({ path: info.outputPath(`bifrost-${theme}-${width}-${height}.png`) });
  68  |     }
  69  |     await page.setViewportSize({ width: 1440, height: 900 });
> 70  |     expect((await new Axe({ page }).analyze()).violations).toEqual([]);
      |                                                            ^ Error: expect(received).toEqual(expected) // deep equality
  71  |     await page.setViewportSize({ width: 320, height: 700 });
  72  |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
  73  |       true,
  74  |     );
  75  |     await page.getByRole('link', { name: t.labLink, exact: true }).focus();
  76  |     await expect(page.getByRole('link', { name: t.labLink, exact: true })).toBeInViewport();
  77  |     expect((await new Axe({ page }).analyze()).violations).toEqual([]);
  78  |   });
  79  | }
  80  |
  81  | test('Bifrost theme defaults to system and remembers only a visual preference across reload and tabs', async ({
  82  |   page,
  83  |   context,
  84  | }) => {
  85  |   await page.emulateMedia({ colorScheme: 'dark' });
  86  |   await page.goto('/');
  87  |   await expect(appearance(page)).toHaveValue('system');
  88  |   await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  89  |   expect(await page.evaluate((key) => localStorage.getItem(key), visualKey)).toBeNull();
  90  |   const before = await workBytes(page);
  91  |   await appearance(page).selectOption('light');
  92  |   await page.reload();
  93  |   await expect(appearance(page)).toHaveValue('light');
  94  |   await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'light');
  95  |   const other = await context.newPage();
  96  |   await other.goto('/');
  97  |   await appearance(other).selectOption('dark');
  98  |   await expect(appearance(page)).toHaveValue('dark');
  99  |   await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  100 |   await appearance(page).selectOption('system');
  101 |   await page.emulateMedia({ colorScheme: 'light' });
  102 |   await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'light');
  103 |   expect(await workBytes(page)).toBe(before);
  104 |   await other.close();
  105 | });
  106 |
  107 | test('Bifrost blocked visual storage remains usable and honest with keyboard and reduced motion', async ({
  108 |   page,
  109 | }) => {
  110 |   await page.addInitScript((key) => {
  111 |     const read = Storage.prototype.getItem;
  112 |     const write = Storage.prototype.setItem;
  113 |     Storage.prototype.getItem = function (name) {
  114 |       if (name === key) throw new DOMException('Denied', 'SecurityError');
  115 |       return read.call(this, name);
  116 |     };
  117 |     Storage.prototype.setItem = function (name, value) {
  118 |       if (name === key) throw new DOMException('Denied', 'SecurityError');
  119 |       return write.call(this, name, value);
  120 |     };
  121 |   }, visualKey);
  122 |   await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  123 |   await page.goto('/');
  124 |   await appearance(page).selectOption('dark');
  125 |   await expect(page.locator('html')).toHaveAttribute('data-bf-theme', 'dark');
  126 |   await expect(page.locator('.bifrost-theme-storage-note')).toHaveText(
  127 |     'Valget brukes her, men kan ikke lagres i nettleseren.',
  128 |   );
  129 |   const before = await workBytes(page);
  130 |   const course = page.getByRole('link', { name: t.az900Link, exact: true });
  131 |   const lab = page.getByRole('link', { name: t.labLink, exact: true });
  132 |   await course.focus();
  133 |   await page.keyboard.press('Tab');
  134 |   await expect(lab).toBeFocused();
  135 |   await lab.hover();
  136 |   expect(await lab.evaluate((link) => getComputedStyle(link.parentElement!).transform)).toBe(
  137 |     'none',
  138 |   );
  139 |   await course.focus();
  140 |   await page.keyboard.press('Enter');
  141 |   await expect(page).toHaveURL('/learn');
  142 |   expect(await workBytes(page)).toBe(before);
  143 | });
  144 |
  145 | test('Bifrost palette changes leave the actual course and free Azure Portals identical even beneath a learning wrapper', async ({
  146 |   page,
  147 | }, info) => {
  148 |   for (const route of ['/portal', '/labs/laboratory']) {
  149 |     await page.goto(route);
  150 |     if (route === '/labs/laboratory') {
  151 |       await page.getByRole('button', { name: temporary.start, exact: true }).click();
  152 |     }
  153 |     const portal = page.locator('.portal[data-portal-mode]:visible');
  154 |     await expect(portal).toHaveCount(1);
  155 |     await expect(portal.locator('.portal-header')).toBeVisible();
  156 |     await portal.evaluate((root) => {
  157 |       const wrapper = document.createElement('div');
  158 |       wrapper.className = 'bifrost-learning';
  159 |       wrapper.style.fontFamily = 'var(--bf-font-open-sans)';
  160 |       root.before(wrapper);
  161 |       wrapper.append(root);
  162 |     });
  163 |     const styles = () =>
  164 |       portal.evaluate((root) =>
  165 |         [root, ...root.querySelectorAll('header, main, input, button, select')].map((node) => {
  166 |           const css = getComputedStyle(node);
  167 |           return {
  168 |             tag: node.tagName,
  169 |             font: css.fontFamily,
  170 |             background: css.backgroundColor,
```
