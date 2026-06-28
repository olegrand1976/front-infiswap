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
