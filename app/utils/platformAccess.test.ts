import { describe, expect, it } from 'vitest';
import {
    isPlatformAccessRole,
    isRegisteredAfterPlatformAccessCutoff,
    validateCreateReplacementForm,
    validateImmediateReplacementForm,
} from './platformAccess';

describe('platformAccess', () => {
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
