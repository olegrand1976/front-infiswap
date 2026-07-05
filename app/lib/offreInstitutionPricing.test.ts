import { describe, expect, it } from 'vitest';
import {
    getInstitutionDiyMonthlyPrice,
    getInstitutionDiyPromoLastDayLabel,
    getInstitutionDiyPromoValidityLabel,
    getInstitutionDiyYearlyPrice,
    INSTITUTION_DIY_FULL_MONTHLY,
    INSTITUTION_DIY_FULL_YEARLY,
    INSTITUTION_DIY_PROMO_END_EXCLUSIVE,
    INSTITUTION_DIY_PROMO_MONTHLY,
    INSTITUTION_DIY_PROMO_YEARLY,
    isInstitutionDiyPromoActive,
} from './offreInstitutionPricing';

describe('offreInstitutionPricing', () => {
    const lastPromoDay = new Date(2026, 7, 31, 23, 59, 59);
    const firstFullPriceDay = new Date(INSTITUTION_DIY_PROMO_END_EXCLUSIVE);

    it('active la promo jusqu’au dernier instant du 31/08/2026', () => {
        expect(isInstitutionDiyPromoActive(lastPromoDay)).toBe(true);
        expect(getInstitutionDiyMonthlyPrice(lastPromoDay)).toBe(INSTITUTION_DIY_PROMO_MONTHLY);
        expect(getInstitutionDiyYearlyPrice(lastPromoDay)).toBe(INSTITUTION_DIY_PROMO_YEARLY);
    });

    it('bascule au tarif plein à partir du 01/09/2026', () => {
        expect(isInstitutionDiyPromoActive(firstFullPriceDay)).toBe(false);
        expect(getInstitutionDiyMonthlyPrice(firstFullPriceDay)).toBe(INSTITUTION_DIY_FULL_MONTHLY);
        expect(getInstitutionDiyYearlyPrice(firstFullPriceDay)).toBe(INSTITUTION_DIY_FULL_YEARLY);
    });

    it('expose un libellé de validité cohérent avec la date de fin', () => {
        expect(getInstitutionDiyPromoLastDayLabel()).toBe('31/08/2026');
        expect(getInstitutionDiyPromoValidityLabel()).toBe('Offre valable jusqu\'au 31/08/2026');
    });
});
