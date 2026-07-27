/**
 * Cookie `selectedFilters` / filtres type remplacement.
 * L’API n’accepte que `all|classic|immediate` — jamais `urgent` (label UI legacy).
 */
export function normalizeSelectedFiltersType(type: string | undefined | null): string {
    if (type === 'urgent') {
        return 'immediate';
    }

    return type ?? 'all';
}

export type SelectedFiltersShape = {
    type: string;
    role: string;
    status?: string;
};

export function normalizeSelectedFilters<T extends { type?: string; role?: string; status?: string }>(
    filters: T,
): T & { type: string } {
    return {
        ...filters,
        type: normalizeSelectedFiltersType(filters.type),
    };
}
