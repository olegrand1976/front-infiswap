export const INSTITUTION_DIY_FULL_MONTHLY = 250;
export const INSTITUTION_DIY_FULL_YEARLY = 2500;
export const INSTITUTION_DIY_PROMO_MONTHLY = 150;
export const INSTITUTION_DIY_PROMO_YEARLY = 1500;

/** Fin exclusive de l'offre promo : à partir du 1/09/2026, tarif plein uniquement. */
export const INSTITUTION_DIY_PROMO_END_EXCLUSIVE = new Date(2026, 8, 1);

const promoLastDayFormatter = new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

export function getInstitutionDiyPromoLastDay(): Date {
    return new Date(
        INSTITUTION_DIY_PROMO_END_EXCLUSIVE.getFullYear(),
        INSTITUTION_DIY_PROMO_END_EXCLUSIVE.getMonth(),
        INSTITUTION_DIY_PROMO_END_EXCLUSIVE.getDate() - 1,
    );
}

export function getInstitutionDiyPromoLastDayLabel(): string {
    return promoLastDayFormatter.format(getInstitutionDiyPromoLastDay());
}

export function getInstitutionDiyPromoValidityLabel(): string {
    return `Offre valable jusqu'au ${getInstitutionDiyPromoLastDayLabel()}`;
}

export function isInstitutionDiyPromoActive(at: Date = new Date()): boolean {
    return at < INSTITUTION_DIY_PROMO_END_EXCLUSIVE;
}

export function getInstitutionDiyMonthlyPrice(at?: Date): number {
    return isInstitutionDiyPromoActive(at) ? INSTITUTION_DIY_PROMO_MONTHLY : INSTITUTION_DIY_FULL_MONTHLY;
}

export function getInstitutionDiyYearlyPrice(at?: Date): number {
    return isInstitutionDiyPromoActive(at) ? INSTITUTION_DIY_PROMO_YEARLY : INSTITUTION_DIY_FULL_YEARLY;
}

export function formatInstitutionDiyAmount(amount: number): string {
    return new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 }).format(amount);
}

export function formatInstitutionDiyMonthlyLabel(amount?: number): string {
    return `${formatInstitutionDiyAmount(amount ?? getInstitutionDiyMonthlyPrice())} € / mois`;
}

export function formatInstitutionDiyYearlyLabel(amount?: number): string {
    return `${formatInstitutionDiyAmount(amount ?? getInstitutionDiyYearlyPrice())} € / an`;
}

export { getInstitutionPriceLockLabel } from './institutionSubscriptionPolicy';
