export function isInstitutionFullyValidated(user: {
    institution?: { status?: string | null } | null;
    validate_at?: string | null;
}): boolean {
    const institutionStatus = user.institution?.status;
    return institutionStatus === 'active' || !!user.validate_at;
}

/** Redirect target for an institution user landing on `to`, or null if this isn't a route the guard cares about. */
export function institutionEntryRedirect(to: { path: string }, isFullyValidated: boolean): string | null {
    const isEntryRoute = to.path === '/dashboard'
        || (to.path.startsWith('/dashboard')
            && !to.path.startsWith('/dashboard/institution')
            && !to.path.startsWith('/dashboard/replacements/detail/'));

    if (!isEntryRoute) {
        return null;
    }

    return isFullyValidated ? '/dashboard/institution' : '/dashboard/institution/pending-validation';
}
