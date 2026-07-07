import {
    INSTITUTION_DIY_FULL_MONTHLY,
    INSTITUTION_DIY_FULL_YEARLY,
    INSTITUTION_DIY_PROMO_MONTHLY,
    INSTITUTION_DIY_PROMO_YEARLY,
    getInstitutionDiyPromoValidityLabel,
    isInstitutionDiyPromoActive,
} from './offreInstitutionPricing';

export const INSTITUTION_MONTHLY_COMMITMENT_MONTHS = 12;
export const INSTITUTION_YEARLY_COMMITMENT_MONTHS = 12;

export const INSTITUTION_AMOUNT_RANGES = {
    monthly: { min: 150, max: 250 },
    yearly: { min: 1500, max: 2500 },
} as const;

export function getInstitutionCommitmentLabel(_paymentMode: 'monthly' | 'yearly' = 'monthly'): string {
    return `${INSTITUTION_MONTHLY_COMMITMENT_MONTHS} mois (Renouvelable)`;
}

export function getInstitutionPriceLockLabel(): string {
    return 'Tarif signé garanti à vie (hors indexation annuelle éventuelle)';
}

export {
    INSTITUTION_DIY_FULL_MONTHLY,
    INSTITUTION_DIY_FULL_YEARLY,
    INSTITUTION_DIY_PROMO_MONTHLY,
    INSTITUTION_DIY_PROMO_YEARLY,
    getInstitutionDiyPromoValidityLabel,
    isInstitutionDiyPromoActive,
};
