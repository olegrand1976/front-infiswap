export type EducationLevelValue = 'a1' | 'a2';

export const EDUCATION_LEVEL_OPTIONS: { value: EducationLevelValue; label: string }[] = [
    { value: 'a1', label: 'Gradué (A1)' },
    { value: 'a2', label: 'Brevet (A2)' },
];

export function educationLevelLabel(value?: string | null): string | null {
    if (!value) {
        return null;
    }
    return EDUCATION_LEVEL_OPTIONS.find(option => option.value === value)?.label ?? null;
}

export function isBelgiumCountryCode(country?: string | null): boolean {
    if (!country) {
        return false;
    }
    const normalized = country.trim().toLowerCase();
    return normalized === 'be' || normalized === 'belgique' || normalized === 'belgium';
}

export function needsEducationLevel(user: {
    type?: string | null;
    account_type?: string | null;
    institution?: unknown;
    roles?: string[] | null;
    country?: string | null;
    education_level?: string | null;
} | null | undefined): boolean {
    if (!user) {
        return false;
    }
    if (
        user.type === 'institution'
        || user.account_type === 'institution'
        || user.institution
    ) {
        return false;
    }
    const roles = user.roles ?? [];
    if (!roles.includes('nurse')) {
        return false;
    }
    if (!isBelgiumCountryCode(user.country)) {
        return false;
    }
    return !user.education_level;
}

export function hasRealIdentifier(user: {
    identifier_number?: string | null;
    identifier_unavailable?: boolean | null;
    has_real_identifier?: boolean | null;
} | null | undefined): boolean {
    if (!user) {
        return false;
    }
    if (typeof user.has_real_identifier === 'boolean') {
        return user.has_real_identifier;
    }
    if (user.identifier_unavailable) {
        return false;
    }
    const value = user.identifier_number;
    if (!value || !String(value).trim()) {
        return false;
    }
    return !String(value).startsWith('TEMP_');
}
