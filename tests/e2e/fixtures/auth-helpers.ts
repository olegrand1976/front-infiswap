import { expect, type Locator, type Page } from '@playwright/test';
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

    const workingCountriesBlock = form.locator('div.col-span-4').filter({ hasText: 'Pays de recherche' });
    const belgiumCheckbox = workingCountriesBlock.getByRole('checkbox').first();
    await belgiumCheckbox.scrollIntoViewIfNeeded();

    // La Belgique est pré-cochée via SSR (useCountry). On force l'état "coché" de
    // façon déterministe : un simple toggle décocherait le pays et invaliderait le
    // formulaire selon le timing d'hydratation.
    await expect(belgiumCheckbox).toBeVisible();
    if ((await belgiumCheckbox.getAttribute('aria-checked')) !== 'true') {
        await belgiumCheckbox.click();
    }
    await expect(belgiumCheckbox).toBeChecked();

    // Le <Select> radix est portalisé : en CI headless, un simple clic trigger + clic
    // option peut ne pas committer la valeur (race d'animation), laissant
    // professionalCategory vide et le bouton désactivé. On réessaie l'ouverture jusqu'à
    // ce que l'option soit réellement visible, puis on vérifie que le trigger reflète
    // bien la sélection.
    const categoryTrigger = form.getByRole('combobox').filter({ hasText: 'Catégorie professionnelle' });
    await categoryTrigger.scrollIntoViewIfNeeded();
    const independentOption = page.getByRole('option', { name: 'Indépendant(e)' });
    await expect(async () => {
        await categoryTrigger.click();
        await expect(independentOption).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
    await independentOption.click();
    await expect(form.getByRole('combobox').filter({ hasText: 'Indépendant(e)' })).toBeVisible();

    const charteCheckbox = form.getByRole('checkbox', { name: 'charte de bonne conduite' });
    await charteCheckbox.scrollIntoViewIfNeeded();
    if ((await charteCheckbox.getAttribute('aria-checked')) !== 'true') {
        await charteCheckbox.click();
    }
    await expect(charteCheckbox).toBeChecked();
}

export async function submitRegistration(page: Page): Promise<void> {
    const submitButton = visibleRegistrationForm(page).getByRole('button', { name: "S'inscrire" });
    await expect(submitButton).toBeEnabled({ timeout: 15_000 });
    await submitButton.click();
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
