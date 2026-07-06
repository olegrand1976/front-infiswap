export function isReplacementActivelyBoosted(item: {
    is_boosted?: boolean;
    boosted_until?: string | null;
}): boolean {
    if (!item.is_boosted) {
        return false;
    }

    if (item.boosted_until) {
        return new Date(item.boosted_until).getTime() > Date.now();
    }

    return true;
}

/**
 * Peut booster ce remplacement ?
 * - Propriétaire uniquement (Mes remplacements)
 * - Tout le monde, y compris admin / staff InfiSwap
 * - Sauf comptes institution (déjà en tête de liste par défaut)
 * - Sauf remplacement lié à une institution
 * - Uniquement si ouvert et sans remplaçant confirmé
 */
export function canBoostReplacement(
    replacement: {
        institution_id?: number | null;
        status?: string;
        has_confirmed_substitute?: boolean;
    },
    options: {
        listType?: string;
        isInstitutionUser?: boolean;
    } = {},
): boolean {
    const { listType = 'me', isInstitutionUser = false } = options;

    if (listType !== 'me' || isInstitutionUser) {
        return false;
    }

    if (replacement.institution_id) {
        return false;
    }

    if (replacement.status !== 'open') {
        return false;
    }

    if (replacement.has_confirmed_substitute === true) {
        return false;
    }

    return true;
}

export function sortByCreatedAtDesc<T extends { created_at?: string }>(items: T[]): T[] {
    return [...items].sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
    );
}

export function sortRegularReplacements<T extends {
    institution_id?: number | null;
    created_at?: string;
}>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const aInst = a.institution_id ? 0 : 1;
        const bInst = b.institution_id ? 0 : 1;
        if (aInst !== bInst) return aInst - bInst;

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
}

export function isTopSectionItem(item: {
    record_type?: string;
    institution_id?: number | null;
    is_boosted?: boolean;
    boosted_until?: string | null;
}): boolean {
    if (item.record_type === 'mission') {
        return true;
    }

    if (item.record_type !== 'replacement') {
        return false;
    }

    if (item.institution_id) {
        return true;
    }

    return isReplacementActivelyBoosted(item);
}

export function topSectionSortKey(item: {
    record_type?: string;
    institution_id?: number | null;
    is_boosted?: boolean;
    boosted_until?: string | null;
}): number {
    if (item.record_type === 'mission') {
        return 0;
    }

    if (item.institution_id) {
        return 1;
    }

    if (isReplacementActivelyBoosted(item)) {
        return 2;
    }

    return 3;
}

export function sortTopSectionItems<T extends {
    record_type?: string;
    institution_id?: number | null;
    is_boosted?: boolean;
    boosted_until?: string | null;
    created_at?: string;
}>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const keyDiff = topSectionSortKey(a) - topSectionSortKey(b);
        if (keyDiff !== 0) {
            return keyDiff;
        }

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
}

export function sortReplacementsByBoost<T extends {
    institution_id?: number | null;
    is_boosted?: boolean;
    boosted_until?: string | null;
    created_at?: string;
}>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const aInst = a.institution_id ? 0 : 1;
        const bInst = b.institution_id ? 0 : 1;
        if (aInst !== bInst) return aInst - bInst;

        const aBoost = isReplacementActivelyBoosted(a) ? 0 : 1;
        const bBoost = isReplacementActivelyBoosted(b) ? 0 : 1;
        if (aBoost !== bBoost) return aBoost - bBoost;

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
}

export type ReplacementBoostPlan = {
    id: number;
    label?: string;
    amount?: string | number;
    interval?: string;
    duration_days?: number;
    description?: string | null;
};
