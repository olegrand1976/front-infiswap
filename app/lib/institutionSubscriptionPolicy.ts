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

export type InstitutionSubscriptionPolicyData = {
    monthly_commitment_months: number;
    yearly_commitment_months: number;
    price_lock_enabled: boolean;
    amount_ranges: {
        monthly: { min: number; max: number };
        yearly: { min: number; max: number };
    };
};

const DEFAULT_POLICY: InstitutionSubscriptionPolicyData = {
    monthly_commitment_months: INSTITUTION_MONTHLY_COMMITMENT_MONTHS,
    yearly_commitment_months: INSTITUTION_YEARLY_COMMITMENT_MONTHS,
    price_lock_enabled: true,
    amount_ranges: {
        monthly: { ...INSTITUTION_AMOUNT_RANGES.monthly },
        yearly: { ...INSTITUTION_AMOUNT_RANGES.yearly },
    },
};

let loadedPolicy: InstitutionSubscriptionPolicyData | null = null;
let loadPromise: Promise<InstitutionSubscriptionPolicyData> | null = null;

export function resetInstitutionSubscriptionPolicyForTests() {
    loadedPolicy = null;
    loadPromise = null;
}

export function getLoadedInstitutionSubscriptionPolicy(): InstitutionSubscriptionPolicyData | null {
    return loadedPolicy;
}

export async function loadInstitutionSubscriptionPolicy(force = false): Promise<InstitutionSubscriptionPolicyData> {
    if (loadedPolicy && !force) {
        return loadedPolicy;
    }

    if (loadPromise && !force) {
        return loadPromise;
    }

    loadPromise = (async () => {
        try {
            const { useNuxtApp } = await import('#app');
            const { $apifetch } = useNuxtApp();
            const response = await $apifetch('api/public/institution-subscription-policy');
            const data = (response.data ?? response) as Partial<InstitutionSubscriptionPolicyData>;
            loadedPolicy = {
                monthly_commitment_months: data.monthly_commitment_months ?? DEFAULT_POLICY.monthly_commitment_months,
                yearly_commitment_months: data.yearly_commitment_months ?? DEFAULT_POLICY.yearly_commitment_months,
                price_lock_enabled: data.price_lock_enabled ?? DEFAULT_POLICY.price_lock_enabled,
                amount_ranges: {
                    monthly: {
                        min: data.amount_ranges?.monthly?.min ?? DEFAULT_POLICY.amount_ranges.monthly.min,
                        max: data.amount_ranges?.monthly?.max ?? DEFAULT_POLICY.amount_ranges.monthly.max,
                    },
                    yearly: {
                        min: data.amount_ranges?.yearly?.min ?? DEFAULT_POLICY.amount_ranges.yearly.min,
                        max: data.amount_ranges?.yearly?.max ?? DEFAULT_POLICY.amount_ranges.yearly.max,
                    },
                },
            };
        }
        catch {
            loadedPolicy = { ...DEFAULT_POLICY, amount_ranges: {
                monthly: { ...DEFAULT_POLICY.amount_ranges.monthly },
                yearly: { ...DEFAULT_POLICY.amount_ranges.yearly },
            } };
        }

        return loadedPolicy;
    })();

    return loadPromise;
}

function resolvePolicy(): InstitutionSubscriptionPolicyData {
    return loadedPolicy ?? DEFAULT_POLICY;
}

export function getInstitutionMonthlyCommitmentMonths(): number {
    return resolvePolicy().monthly_commitment_months;
}

export function getInstitutionYearlyCommitmentMonths(): number {
    return resolvePolicy().yearly_commitment_months;
}

export function getInstitutionAmountRanges() {
    return resolvePolicy().amount_ranges;
}

export function isInstitutionPriceLockEnabled(): boolean {
    return resolvePolicy().price_lock_enabled;
}

export function getInstitutionCommitmentLabel(_paymentMode: 'monthly' | 'yearly' = 'monthly'): string {
    const months = _paymentMode === 'yearly'
        ? getInstitutionYearlyCommitmentMonths()
        : getInstitutionMonthlyCommitmentMonths();
    return `${months} mois (Renouvelable)`;
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
