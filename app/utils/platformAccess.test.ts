import { describe, expect, it } from 'vitest';
import {
    hasLifetimeNetworkAccess,
    hasPaidPlatformAccess,
    showsPaidNetworkAccessBadge,
    isLocallyExemptFromPlatformPayment,
    isPlatformAccessRole,
    isRegisteredAfterPlatformAccessCutoff,
    isSubjectToPlatformAccessPayment,
    isNurseSubjectToPlatformAccessPayment,
    resolvePlatformAccessPromptAction,
    validateCreateReplacementForm,
    validateImmediateReplacementForm,
} from './platformAccess';
import {
    safeLoginRedirectPath,
    safeReturnPath,
    extractStripeSessionId,
    isStripeCheckoutSessionId,
    parseConfirmAccessOutcome,
} from './accessReturn';

describe('platformAccess', () => {
    it('detects paid platform access', () => {
        expect(hasPaidPlatformAccess({ platform_access_paid_at: '2026-07-06T10:00:00Z' })).toBe(true);
        expect(hasPaidPlatformAccess({ platform_access_paid_at: null })).toBe(false);
        expect(hasPaidPlatformAccess(null)).toBe(false);
    });

    it('shows golden network badge only for paid post-cutoff nurse', () => {
        expect(showsPaidNetworkAccessBadge({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: '2026-07-06T10:00:00Z',
        })).toBe(true);
        expect(showsPaidNetworkAccessBadge({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: null,
        })).toBe(false);
        expect(showsPaidNetworkAccessBadge({
            roles: ['nurse'],
            created_at: '2026-06-15T10:00:00',
            platform_access_paid_at: '2026-07-06T10:00:00Z',
        })).toBe(false);
    });

    it('detects lifetime network access for paid and legacy users', () => {
        expect(hasLifetimeNetworkAccess({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: '2026-07-06T10:00:00Z',
        })).toBe(true);
        expect(hasLifetimeNetworkAccess({
            roles: ['nurse'],
            created_at: '2026-06-15T10:00:00',
            platform_access_paid_at: null,
        })).toBe(true);
        expect(hasLifetimeNetworkAccess({
            roles: ['developer'],
            created_at: '2026-06-15T10:00:00',
            platform_access_paid_at: null,
        })).toBe(true);
        expect(hasLifetimeNetworkAccess({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: null,
        })).toBe(false);
        expect(hasLifetimeNetworkAccess({
            type: 'institution',
            roles: ['nurse'],
            created_at: '2026-06-15T10:00:00',
            platform_access_paid_at: null,
        })).toBe(false);
    });

    it('detects local exemption when already paid', () => {
        expect(isLocallyExemptFromPlatformPayment({
            id: 1,
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: '2026-07-06T10:00:00Z',
        }, { bypassesPlatformAccess: false })).toBe(true);
    });

    it('requires payment for unpaid nurse post-cutoff', () => {
        expect(isLocallyExemptFromPlatformPayment({
            id: 1,
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: null,
        }, { bypassesPlatformAccess: false })).toBe(false);
    });

    it('does not exempt when roles are missing from cached profile', () => {
        expect(isLocallyExemptFromPlatformPayment({
            id: 1,
            roles: [],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: null,
        }, { bypassesPlatformAccess: false })).toBe(false);
    });

    it('detects users subject to platform access payment', () => {
        expect(isSubjectToPlatformAccessPayment({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
        })).toBe(true);
        expect(isSubjectToPlatformAccessPayment({
            account_type: 'nurse',
            roles: [],
            created_at: '2026-07-02T10:00:00',
        })).toBe(true);
        expect(isSubjectToPlatformAccessPayment({
            roles: ['collaborator'],
            created_at: '2026-07-02T10:00:00',
        })).toBe(false);
    });

    it('detects nurse-only post-cutoff registration for admin registrations column', () => {
        expect(isNurseSubjectToPlatformAccessPayment({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
        })).toBe(true);
        expect(isNurseSubjectToPlatformAccessPayment({
            roles: ['caregiver'],
            created_at: '2026-07-02T10:00:00',
        })).toBe(false);
        expect(isNurseSubjectToPlatformAccessPayment({
            roles: ['nurse'],
            created_at: '2026-06-15T10:00:00',
        })).toBe(false);
    });

    it('preserves login redirect with session_id on acces-plan', () => {
        expect(safeLoginRedirectPath('/acces-plan?session_id=cs_test&redirectTo=/dashboard'))
            .toBe('/acces-plan?session_id=cs_test&redirectTo=/dashboard');
        expect(safeReturnPath('/acces-plan?session_id=cs_test')).toBe('/dashboard');
        expect(safeLoginRedirectPath('//evil')).toBe('/dashboard');
    });


    it('validates stripe checkout session id format', () => {
        expect(isStripeCheckoutSessionId('cs_live_test')).toBe(true);
        expect(isStripeCheckoutSessionId('invalid')).toBe(false);
    });

    it('parses confirm access outcomes', () => {
        expect(parseConfirmAccessOutcome({ status: 'active' })).toBe('active');
        expect(parseConfirmAccessOutcome({ status: 'pending' })).toBe('pending');
        expect(parseConfirmAccessOutcome(null, { status: 202, data: { status: 'pending' } })).toBe('pending');
        expect(parseConfirmAccessOutcome(null, { status: 401 })).toBe('auth_error');
        expect(parseConfirmAccessOutcome(null, { status: 403 })).toBe('auth_error');
        expect(parseConfirmAccessOutcome(null, { status: 500 })).toBe('error');
    });

    it('extracts stripe session id from route query', () => {
        expect(extractStripeSessionId({ session_id: 'cs_live_test' })).toBe('cs_live_test');
        expect(extractStripeSessionId({ session_id: ['cs_live_test'] })).toBe('cs_live_test');
        expect(extractStripeSessionId({})).toBeNull();
    });

    it('resolves platform access prompt action from check result', () => {
        expect(resolvePlatformAccessPromptAction({ payment_required: false, status: 'active' }, false))
            .toBe('allow');
        expect(resolvePlatformAccessPromptAction({ payment_required: true, status: 'expired' }, false))
            .toBe('prompt_payment');
        expect(resolvePlatformAccessPromptAction(null, false)).toBe('deny');
        expect(resolvePlatformAccessPromptAction({ payment_required: true }, true)).toBe('allow');
    });
    it('detects platform access roles', () => {
        expect(isPlatformAccessRole(['nurse'])).toBe(true);
        expect(isPlatformAccessRole(['collaborator'])).toBe(false);
    });

    it('detects cutoff registration date', () => {
        expect(isRegisteredAfterPlatformAccessCutoff('2026-07-01T10:00:00')).toBe(true);
        expect(isRegisteredAfterPlatformAccessCutoff('2026-06-30T23:59:59')).toBe(false);
    });

    it('validates create replacement form', () => {
        const error = validateCreateReplacementForm({
            periods: [{ startDate: '', endDate: '' }],
            roleType: null,
            patientCount: null,
            zipCodes: [],
            careTypes: [],
            timeSlot: {
                morning: { startAt: '', endAt: '' },
                evening: { startAt: '', endAt: '' },
            },
        });

        expect(error).toBeTruthy();
    });

    it('validates immediate replacement form', () => {
        const error = validateImmediateReplacementForm({
            startTime: '09:00',
            endTime: '08:00',
            patientCount: '0',
            roleType: 'nurse',
            zipCodes: ['5000'],
            cities: ['Namur'],
            careTypes: [1],
        });

        expect(error).toContain('heure de fin');
    });
});
