import { describe, expect, it } from 'vitest';
import {
    hasLifetimeNetworkAccess,
    hasPaidPlatformAccess,
    hasVerifiedMemberBadge,
    isSubjectToPlatformAccessPayment,
    resolvePlatformAccessPromptAction,
    validateCreateReplacementForm,
} from './platformAccess';
import { safeLoginRedirectPath, safeReturnPath } from './accessReturn';

describe('platformAccess', () => {
    it('detects paid platform access historically', () => {
        expect(hasPaidPlatformAccess({ platform_access_paid_at: '2026-07-06T10:00:00Z' })).toBe(true);
        expect(hasPaidPlatformAccess({ platform_access_paid_at: null })).toBe(false);
        expect(hasPaidPlatformAccess(null)).toBe(false);
    });

    it('never subjects users to platform access payment after retirement', () => {
        expect(isSubjectToPlatformAccessPayment({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
        })).toBe(false);
    });

    it('shows verified member badge when email is confirmed', () => {
        expect(hasVerifiedMemberBadge({
            email_verified_at: '2026-07-06T10:00:00Z',
        })).toBe(true);
        expect(hasLifetimeNetworkAccess({
            email_verified_at: '2026-07-06T10:00:00Z',
        })).toBe(true);
        expect(hasVerifiedMemberBadge({
            email_verified_at: null,
        })).toBe(false);
        expect(hasVerifiedMemberBadge({
            type: 'institution',
            email_verified_at: '2026-07-06T10:00:00Z',
        })).toBe(false);
    });

    it('preserves login redirect helpers', () => {
        expect(safeLoginRedirectPath('/dashboard?session_id=cs_test'))
            .toBe('/dashboard?session_id=cs_test');
        expect(safeReturnPath('/acces-plan?session_id=cs_test')).toBe('/dashboard');
    });

    it('allows when payment_required is false', () => {
        expect(resolvePlatformAccessPromptAction({ payment_required: false, status: 'active' }, false))
            .toBe('allow');
        expect(resolvePlatformAccessPromptAction({ payment_required: true }, true)).toBe('allow');
    });

    it('validates create replacement form periods', () => {
        expect(validateCreateReplacementForm({
            periods: [],
            roleType: 'nurse',
            patientCount: 2,
            zipCodes: ['1000'],
            careTypes: [1],
            timeSlot: {
                morning: { startAt: '08:00', endAt: '12:00' },
                evening: { startAt: '', endAt: '' },
            },
        })).toContain('période');
    });
});
