import {
    formatInstitutionDiyAmount,
    formatInstitutionDiyMonthlyLabel,
    formatInstitutionDiyYearlyLabel,
    getInstitutionDiyMonthlyPrice,
    getInstitutionDiyPromoValidityLabel,
    getInstitutionDiyYearlyPrice,
    INSTITUTION_DIY_FULL_MONTHLY,
    INSTITUTION_DIY_FULL_YEARLY,
    isInstitutionDiyPromoActive,
} from '~/lib/offreInstitutionPricing';

export function useInstitutionDiyPricing() {
    const diyPromoActive = computed(() => isInstitutionDiyPromoActive());
    const diyPromoValidityLabel = computed(() => getInstitutionDiyPromoValidityLabel());
    const diyMonthlyPrice = computed(() => getInstitutionDiyMonthlyPrice());
    const diyYearlyPrice = computed(() => getInstitutionDiyYearlyPrice());
    const calcDiyPlan = computed(() => diyMonthlyPrice.value);
    const diyMonthlyLabel = computed(() => formatInstitutionDiyMonthlyLabel(diyMonthlyPrice.value));
    const diyYearlyLabel = computed(() => formatInstitutionDiyYearlyLabel(diyYearlyPrice.value));
    const diyFullMonthlyLabel = computed(() => formatInstitutionDiyMonthlyLabel(INSTITUTION_DIY_FULL_MONTHLY));
    const diyFullYearlyLabel = computed(() => formatInstitutionDiyYearlyLabel(INSTITUTION_DIY_FULL_YEARLY));
    const diyYearlyShortLabel = computed(() => `${formatInstitutionDiyAmount(diyYearlyPrice.value)} € / an`);
    const diyFullYearlyShortLabel = computed(() => `${formatInstitutionDiyAmount(INSTITUTION_DIY_FULL_YEARLY)} € / an`);
    const diyMonthlyAmountLabel = computed(() => `${formatInstitutionDiyAmount(diyMonthlyPrice.value)} €`);
    const diyFullMonthlyAmountLabel = computed(() => `${formatInstitutionDiyAmount(INSTITUTION_DIY_FULL_MONTHLY)} €`);
    const diyYearlyAmountLabel = computed(() => `${formatInstitutionDiyAmount(diyYearlyPrice.value)} €`);
    const diyFullYearlyAmountLabel = computed(() => `${formatInstitutionDiyAmount(INSTITUTION_DIY_FULL_YEARLY)} €`);
    const diyYearlyMonthlyEquivalentLabel = computed(
        () => `${formatInstitutionDiyAmount(Math.round(diyYearlyPrice.value / 12))} € / mois`,
    );

    return {
        diyPromoActive,
        diyPromoValidityLabel,
        diyMonthlyPrice,
        diyYearlyPrice,
        calcDiyPlan,
        diyMonthlyLabel,
        diyYearlyLabel,
        diyFullMonthlyLabel,
        diyFullYearlyLabel,
        diyYearlyShortLabel,
        diyFullYearlyShortLabel,
        diyMonthlyAmountLabel,
        diyFullMonthlyAmountLabel,
        diyYearlyAmountLabel,
        diyFullYearlyAmountLabel,
        diyYearlyMonthlyEquivalentLabel,
    };
}
