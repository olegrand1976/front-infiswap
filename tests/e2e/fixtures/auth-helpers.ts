import type { Page } from '@playwright/test';
import type { RegistrationFormData } from './test-data';

export async function fillLoginForm(page: Page, identifier: string, password: string): Promise<void> {
    await page.getByPlaceholder('Email').first().fill(identifier);
    await page.getByPlaceholder('Mot de passe').first().fill(password);
}

export async function submitLogin(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Se connecter' }).first().click();
}

export async function fillRegistrationForm(page: Page, data: RegistrationFormData): Promise<void> {
    await page.getByPlaceholder('Nom *').fill(data.lastname);
    await page.getByPlaceholder('Prénoms *').fill(data.firstname);
    await page.getByPlaceholder('Email *').fill(data.email);
    await page.getByPlaceholder('N° de téléphone *').fill(data.phoneNumber);
    await page.getByPlaceholder('Mot de passe *').fill(data.password);
    await page.getByPlaceholder('Confirmation mot de passe *').fill(data.password);
    await page.getByPlaceholder('Rue *').fill(data.street);
    await page.getByPlaceholder('Code postal *').fill(data.zipCode);
    await page.getByPlaceholder('Ville *').fill(data.city);

    const belgiumCheckbox = page.locator('label').filter({ hasText: 'Belgique' }).getByRole('checkbox');
    if (!(await belgiumCheckbox.isChecked())) {
        await belgiumCheckbox.click();
    }

    await page.getByRole('combobox').filter({ hasText: 'Catégorie professionnelle' }).click();
    await page.getByRole('option', { name: 'Indépendant(e)' }).click();

    const charteLabel = page.locator('label').filter({ hasText: 'charte de bonne conduite' });
    await charteLabel.getByRole('checkbox').click();
}

export async function submitRegistration(page: Page): Promise<void> {
    await page.getByRole('button', { name: "S'inscrire" }).click();
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
