import { describe, expect, it } from 'vitest';
import {
    hasPaidPlatformAccess,
    isLocallyExemptFromPlatformPayment,
    isPlatformAccessRole,
    isRegisteredAfterPlatformAccessCutoff,
    validateCreateReplacementForm,
    validateImmediateReplacementForm,
} from './platformAccess';
import { safeLoginRedirectPath, safeReturnPath } from './accessReturn';

describe('platformAccess', () => {
    it('detects paid platform access', () => {
        expect(hasPaidPlatformAccess({ platform_access_paid_at: '2026-07-06T10:00:00Z' })).toBe(true);
        expect(hasPaidPlatformAccess({ platform_access_paid_at: null })).toBe(false);
        expect(hasPaidPlatformAccess(null)).toBe(false);
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

    it('preserves login redirect with session_id on acces-plan', () => {
        expect(safeLoginRedirectPath('/acces-plan?session_id=cs_test&redirectTo=/dashboard'))
            .toBe('/acces-plan?session_id=cs_test&redirectTo=/dashboard');
        expect(safeReturnPath('/acces-plan?session_id=cs_test')).toBe('/dashboard');
        expect(safeLoginRedirectPath('//evil')).toBe('/dashboard');
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
