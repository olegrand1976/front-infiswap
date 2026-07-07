import { describe, expect, it, beforeEach } from 'vitest';
import {
    getInstitutionCommitmentLabel,
    getInstitutionMonthlyCommitmentMonths,
    getInstitutionPriceLockLabel,
    getLoadedInstitutionSubscriptionPolicy,
    INSTITUTION_MONTHLY_COMMITMENT_MONTHS,
    resetInstitutionSubscriptionPolicyForTests,
} from './institutionSubscriptionPolicy';

describe('institutionSubscriptionPolicy', () => {
    beforeEach(() => {
        resetInstitutionSubscriptionPolicyForTests();
    });

    it('uses fallback constants before API load', () => {
        expect(INSTITUTION_MONTHLY_COMMITMENT_MONTHS).toBe(12);
        expect(getInstitutionMonthlyCommitmentMonths()).toBe(12);
        expect(getInstitutionCommitmentLabel('monthly')).toBe('12 mois (Renouvelable)');
        expect(getInstitutionCommitmentLabel('yearly')).toBe('12 mois (Renouvelable)');
        expect(getLoadedInstitutionSubscriptionPolicy()).toBeNull();
    });

    it('exposes price lock marketing label', () => {
        expect(getInstitutionPriceLockLabel()).toContain('garanti');
    });
});
