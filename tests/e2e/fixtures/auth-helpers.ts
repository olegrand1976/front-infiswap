import type { Locator, Page } from '@playwright/test';
import type { RegistrationFormData } from './test-data';

function visibleRegistrationForm(page: Page): Locator {
    return page.locator('form:visible').first();
}

export async function fillLoginForm(page: Page, identifier: string, password: string): Promise<void> {
    await page.getByPlaceholder('Email').first().fill(identifier);
    await page.getByPlaceholder('Mot de passe').first().fill(password);
}

export async function submitLogin(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Se connecter' }).first().click();
}

export async function fillRegistrationForm(page: Page, data: RegistrationFormData): Promise<void> {
    const form = visibleRegistrationForm(page);

    await form.getByPlaceholder('Nom *', { exact: true }).fill(data.lastname);
    await form.getByPlaceholder('Prénoms *', { exact: true }).fill(data.firstname);
    await form.getByPlaceholder('Email *', { exact: true }).fill(data.email);
    await form.getByPlaceholder('N° de téléphone *', { exact: true }).fill(data.phoneNumber);
    await form.getByPlaceholder('Mot de passe *', { exact: true }).fill(data.password);
    await form.getByPlaceholder('Confirmation mot de passe *', { exact: true }).fill(data.password);
    await form.getByPlaceholder('Rue *', { exact: true }).fill(data.street);
    await form.getByPlaceholder('Code postal *', { exact: true }).fill(data.zipCode);
    await form.getByPlaceholder('Ville *', { exact: true }).fill(data.city);

    const belgiumCheckbox = form.locator('label').filter({ hasText: 'Belgique' }).getByRole('checkbox');
    if (!(await belgiumCheckbox.isChecked())) {
        await belgiumCheckbox.click();
    }

    await form.getByRole('combobox').filter({ hasText: 'Catégorie professionnelle' }).click();
    await page.getByRole('option', { name: 'Indépendant(e)' }).click();

    const charteLabel = form.locator('label').filter({ hasText: 'charte de bonne conduite' });
    await charteLabel.getByRole('checkbox').click();
}

export async function submitRegistration(page: Page): Promise<void> {
    await visibleRegistrationForm(page).getByRole('button', { name: "S'inscrire" }).click();
}

export async function cleanupE2eUsers(apiUrl: string): Promise<void> {
    const secret = process.env.MONITORING_RUN_SECRET;
    if (!secret) {
        return;
    }

    await fetch(`${apiUrl}/api/monitoring/e2e-cleanup`, {
        method: 'POST',
        headers: {
            'X-Monitoring-Secret': secret,
            Accept: 'application/json',
        },
    }).catch(() => undefined);
}
