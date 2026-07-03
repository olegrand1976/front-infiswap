import type { Pagination, User, CrmInstitution } from '~/lib/types';

const CACHE_STORAGE_KEY = 'crm_list_cache_v2';
const UI_STORAGE_KEY = 'crm_ui_state_v2';
const MAX_CACHE_ENTRIES = 15;

export type CrmFilterOption = {
    name: string | null;
    zip: string | null;
    city: string | null;
    country: string;
    insurance: number | null;
    site: number | null;
    days_without_contact: number | null;
    registration_source: string;
    deleted: boolean;
};

export type CrmSortState = {
    by: string | null;
    order: 'ASC' | 'DESC';
};

export type CrmUiState = {
    option: CrmFilterOption;
    sort: CrmSortState;
    selectedCrm: string;
};

export type CrmCacheEntry = {
    users?: Pagination<User>;
    institutions?: Pagination<CrmInstitution>;
    count: number;
    trashCount?: number;
    cachedAt: number;
};

type CacheStore = {
    order: string[];
    entries: Record<string, CrmCacheEntry>;
};

function isClient(): boolean {
    return import.meta.client;
}

function readCacheStore(): CacheStore {
    if (!isClient()) {
        return { order: [], entries: {} };
    }

    try {
        const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
        if (!raw) {
            return { order: [], entries: {} };
        }

        const parsed = JSON.parse(raw) as CacheStore;

        if (!parsed.order || !parsed.entries) {
            return { order: [], entries: {} };
        }

        return parsed;
    }
    catch {
        return { order: [], entries: {} };
    }
}

function writeCacheStore(store: CacheStore): void {
    if (!isClient()) {
        return;
    }

    sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(store));
}

function normalizeParams(params: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    Object.keys(params)
        .sort()
        .forEach((key) => {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                normalized[key] = value;
            }
        });

    return normalized;
}

export function buildCrmCacheKey(
    page: number,
    perPage: number,
    params: Record<string, unknown>,
    entity: 'users' | 'institutions' = 'users',
): string {
    return JSON.stringify({
        entity,
        page,
        perPage,
        params: normalizeParams(params),
    });
}

export function hasCrmCacheEntry(key: string): boolean {
    const store = readCacheStore();

    return key in store.entries;
}

export function getCrmCacheEntry(key: string): CrmCacheEntry | null {
    const store = readCacheStore();
    const entry = store.entries[key];

    if (!entry) {
        return null;
    }

    store.order = store.order.filter(k => k !== key);
    store.order.push(key);
    writeCacheStore(store);

    return entry;
}

export function setCrmCacheEntry(key: string, entry: CrmCacheEntry): void {
    const store = readCacheStore();

    store.entries[key] = entry;
    store.order = store.order.filter(k => k !== key);
    store.order.push(key);

    while (store.order.length > MAX_CACHE_ENTRIES) {
        const oldest = store.order.shift();
        if (oldest) {
            Reflect.deleteProperty(store.entries, oldest);
        }
    }

    writeCacheStore(store);
}

export function clearCrmCacheKey(key: string): void {
    const store = readCacheStore();

    Reflect.deleteProperty(store.entries, key);
    store.order = store.order.filter(k => k !== key);
    writeCacheStore(store);
}

export function clearCrmCache(): void {
    if (!isClient()) {
        return;
    }

    sessionStorage.removeItem(CACHE_STORAGE_KEY);
}

export function getCrmUiState(): CrmUiState | null {
    if (!isClient()) {
        return null;
    }

    try {
        const raw = sessionStorage.getItem(UI_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        return JSON.parse(raw) as CrmUiState;
    }
    catch {
        return null;
    }
}

export function saveCrmUiState(state: CrmUiState): void {
    if (!isClient()) {
        return;
    }

    sessionStorage.setItem(UI_STORAGE_KEY, JSON.stringify(state));
}

export function useCrmCache() {
    return {
        buildCrmCacheKey,
        hasCrmCacheEntry,
        getCrmCacheEntry,
        setCrmCacheEntry,
        clearCrmCacheKey,
        clearCrmCache,
        getCrmUiState,
        saveCrmUiState,
    };
}
