import { expect, type Page } from '@playwright/test';

// Exercise the unchanged public workbench controls; never manufacture completion in storage.
export async function buildGuided(page: Page) {
  await page
    .locator('.chapter-brief')
    .getByRole('button', { name: 'Overfør tjenestevalget', exact: true })
    .click();
  await page
    .getByRole('combobox', { name: 'Tjenestemodell for teamet', exact: true })
    .selectOption('paas');
  await page
    .getByRole('combobox', { name: 'Hvem drifter plattformens OS?', exact: true })
    .selectOption('microsoft');
  await page
    .getByRole('combobox', {
      name: 'Hvem har ansvar for egen kode og kundens tilgangsvalg?',
      exact: true,
    })
    .selectOption('customer');
  await page.getByRole('button', { name: 'Bekreft operasjonelt ansvar', exact: true }).click();
  await page.getByRole('button', { name: 'Ny resource group', exact: true }).click();
  await page.getByLabel('Ressursnavn', { exact: true }).fill('rg-game-team');
  await page.getByRole('combobox', { name: 'Subscription', exact: true }).selectOption('sub-app');
  await page
    .getByRole('combobox', { name: 'Region for gruppemetadata', exact: true })
    .selectOption('norwayeast');
  await page.getByRole('button', { name: 'Registrer og bruk i oppdraget', exact: true }).click();
  await page.getByRole('button', { name: 'Ny App Service plan', exact: true }).click();
  await page
    .getByRole('radio', { name: 'Planlokasjon velges separat fra gruppemetadata', exact: true })
    .check();
  await page
    .getByRole('radio', { name: 'Webappen bruker hosting-planens lokasjon', exact: true })
    .check();
  await page
    .getByRole('button', { name: 'Lagre prediksjon og undersøk planen', exact: true })
    .click();
  await page.getByLabel('Ressursnavn', { exact: true }).fill('plan-game-team');
  await page
    .getByRole('combobox', { name: 'Region for hosting-plan', exact: true })
    .selectOption('northeurope');
  await page.getByRole('button', { name: 'Registrer og bruk i oppdraget', exact: true }).click();
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await expect(page.locator('.scene-object')).toHaveCount(6);
  await page.getByRole('button', { name: 'Undersøk gjeldende policy', exact: true }).click();
  await expect(page.locator('.chapter-policy-panel')).toContainText('policy-web-location');
  await page.getByRole('button', { name: 'Ny App Service plan', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Region for hosting-plan', exact: true })
    .selectOption('westeurope');
  await page.getByRole('button', { name: 'Registrer og bruk i oppdraget', exact: true }).click();
  await page.getByRole('button', { name: 'Ny webapp', exact: true }).click();
  await page.getByLabel('Ressursnavn', { exact: true }).fill('web-game-team');
  await page.getByRole('combobox', { name: 'Hosting-plan', exact: true }).selectOption('plan-2');
  await page.getByRole('button', { name: 'Registrer og bruk i oppdraget', exact: true }).click();
  await expect(page.locator('.hosting-dependency')).toHaveAttribute('data-to', 'plan-2');
  await page.getByRole('button', { name: 'Forklar sammenhengen', exact: true }).click();
  await page
    .getByRole('radio', { name: 'Planlokasjon velges separat fra gruppemetadata', exact: true })
    .check();
  await page
    .getByRole('radio', { name: 'Webappen bruker hosting-planens lokasjon', exact: true })
    .check();
  await page
    .getByRole('radio', {
      name: 'Velg en tillatt ressurslokasjon; appen følger planen',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Registrer årsaksforklaring', exact: true }).click();
  await expect(page.locator('.guided-build-result')).toContainText(
    'Veiledet konfigurasjon tilfredsstilt',
  );
  await expect(page.locator('.guided-build-result')).toContainText('ikke fullført');
}
