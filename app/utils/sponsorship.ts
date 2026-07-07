export interface SponsorshipPlan {
    id: number;
    name: string;
    amount: number;
    currency: string;
    description?: string | null;
}

export function formatSponsorshipAmount(amount: number, currency = 'eur'): string {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function buildSponsorshipSuccessQuery(path: string): string {
    const separator = path.includes('?') ? '&' : '?';

    return `${path}${separator}sponsorship=success&session_id={CHECKOUT_SESSION_ID}`;
}
