import { describe, expect, it } from 'vitest';
import { dashboardHomeRedirectForRole, emailUnverifiedRedirect, staffOnlyAdminRedirect } from './dashboardEntryGuard';

describe('dashboardEntryGuard utils', () => {
    it('redirects to verify-email only when unverified', () => {
        expect(emailUnverifiedRedirect({ email_verified_at: null })).toBe('/auth/verify-email');
        expect(emailUnverifiedRedirect({ email_verified_at: undefined })).toBe('/auth/verify-email');
        expect(emailUnverifiedRedirect({ email_verified_at: '2026-01-01' })).toBeNull();
    });

    it('gates /dashboard/admin to staff only', () => {
        expect(staffOnlyAdminRedirect({ path: '/dashboard/admin/users' }, false)).toBe('/dashboard');
        expect(staffOnlyAdminRedirect({ path: '/dashboard/admin/users' }, true)).toBeNull();
        expect(staffOnlyAdminRedirect({ path: '/dashboard/replacements' }, false)).toBeNull();
    });

    it('routes manager/sale rep away from the generic dashboard', () => {
        expect(dashboardHomeRedirectForRole({ path: '/dashboard' }, { isManager: true, isSaleRepresentative: false }))
            .toBe('/dashboard/admin/replacements');
        expect(dashboardHomeRedirectForRole({ path: '/dashboard' }, { isManager: false, isSaleRepresentative: true }))
            .toBe('/dashboard/admin/users/crm');
        expect(dashboardHomeRedirectForRole({ path: '/dashboard' }, { isManager: false, isSaleRepresentative: false }))
            .toBeNull();
        expect(dashboardHomeRedirectForRole({ path: '/dashboard/replacements' }, { isManager: true, isSaleRepresentative: false }))
            .toBeNull();
    });
});
