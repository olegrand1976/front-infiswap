import { describe, expect, it } from 'vitest';
import {
    getInstitutionCommitmentLabel,
    getInstitutionPriceLockLabel,
    INSTITUTION_MONTHLY_COMMITMENT_MONTHS,
} from './institutionSubscriptionPolicy';

describe('institutionSubscriptionPolicy', () => {
    it('uses 12 month commitment for monthly and yearly', () => {
        expect(INSTITUTION_MONTHLY_COMMITMENT_MONTHS).toBe(12);
        expect(getInstitutionCommitmentLabel('monthly')).toBe('12 mois (Renouvelable)');
        expect(getInstitutionCommitmentLabel('yearly')).toBe('12 mois (Renouvelable)');
    });

    it('exposes price lock marketing label', () => {
        expect(getInstitutionPriceLockLabel()).toContain('garanti');
    });
});
