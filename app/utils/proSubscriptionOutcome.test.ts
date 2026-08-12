import { describe, expect, it } from 'vitest';
import { parseProOutcome } from './proSubscriptionOutcome';

describe('parseProOutcome', () => {
    it('maps active and pending outcomes', () => {
        expect(parseProOutcome({ outcome: 'active' })).toBe('active');
        expect(parseProOutcome({ outcome: 'pending' })).toBe('pending');
    });

    it('treats mismatch and error as terminal failures', () => {
        expect(parseProOutcome({ outcome: 'mismatch' })).toBe('error');
        expect(parseProOutcome({ outcome: 'error' })).toBe('error');
        expect(parseProOutcome({})).toBe('error');
    });

    it('maps auth and validation failures from thrown errors', () => {
        expect(parseProOutcome(null, { status: 401 })).toBe('auth_error');
        expect(parseProOutcome(null, { status: 403 })).toBe('auth_error');
        expect(parseProOutcome(null, { status: 422, data: { outcome: 'mismatch' } })).toBe('error');
        expect(parseProOutcome(null, { status: 202, data: { outcome: 'pending' } })).toBe('pending');
    });
});
