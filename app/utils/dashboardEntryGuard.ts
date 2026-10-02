/** Shared by auth.ts, admin.ts, institution.ts, become-institution.ts — verified.ts has its own distinct behavior (no `replace`, treats `null` as "still loading"), left untouched. */
export function emailUnverifiedRedirect(user: { email_verified_at?: string | null }): string | null {
    return user.email_verified_at ? null : '/auth/verify-email';
}

/** Shared by auth.ts and admin.ts — the two middlewares that gate `/dashboard/admin` to staff accounts. */
export function staffOnlyAdminRedirect(to: { path: string }, isStaff: boolean): string | null {
    return to.path.startsWith('/dashboard/admin') && !isStaff ? '/dashboard' : null;
}

/** Shared by auth.ts and admin.ts — where a manager/sale rep lands instead of the generic `/dashboard`. */
export function dashboardHomeRedirectForRole(to: { path: string }, options: { isManager: boolean; isSaleRepresentative: boolean }): string | null {
    if (to.path !== '/dashboard') {
        return null;
    }

    if (options.isManager) {
        return '/dashboard/admin/replacements';
    }

    if (options.isSaleRepresentative) {
        return '/dashboard/admin/users/crm';
    }

    return null;
}
