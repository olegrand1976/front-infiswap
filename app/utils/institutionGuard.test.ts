import { describe, expect, it } from 'vitest';
import { institutionEntryRedirect, isInstitutionFullyValidated } from './institutionGuard';

describe('institutionGuard utils', () => {
    it('is fully validated when institution status is active or the user has validate_at', () => {
        expect(isInstitutionFullyValidated({ institution: { status: 'active' } })).toBe(true);
        expect(isInstitutionFullyValidated({ institution: { status: 'pending' }, validate_at: '2026-01-01' })).toBe(true);
        expect(isInstitutionFullyValidated({ institution: { status: 'pending' }, validate_at: null })).toBe(false);
        expect(isInstitutionFullyValidated({ validate_at: null })).toBe(false);
    });

    it('redirects generic dashboard entry routes, validated vs pending', () => {
        expect(institutionEntryRedirect({ path: '/dashboard' }, true)).toBe('/dashboard/institution');
        expect(institutionEntryRedirect({ path: '/dashboard' }, false)).toBe('/dashboard/institution/pending-validation');
        expect(institutionEntryRedirect({ path: '/dashboard/replacements' }, true)).toBe('/dashboard/institution');
    });

    it('leaves institution-prefixed and detail routes alone', () => {
        expect(institutionEntryRedirect({ path: '/dashboard/institution' }, true)).toBeNull();
        expect(institutionEntryRedirect({ path: '/dashboard/institution/settings' }, false)).toBeNull();
        expect(institutionEntryRedirect({ path: '/dashboard/replacements/detail/42' }, false)).toBeNull();
    });

    it('leaves non-dashboard routes alone', () => {
        expect(institutionEntryRedirect({ path: '/login' }, true)).toBeNull();
    });
});
