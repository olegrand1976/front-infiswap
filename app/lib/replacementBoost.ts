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
    is_boosted?: boolean;
    boosted_until?: string | null;
}): boolean {
    if (item.record_type === 'mission') {
        return true;
    }

    return item.record_type === 'replacement' && isReplacementActivelyBoosted(item);
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
