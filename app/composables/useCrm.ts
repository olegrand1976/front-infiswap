import { useState, useNuxtApp } from '#app';
import type { CrmInstitution, Pagination, User } from '~/lib/types';

function clonePagination<T>(pagination: Pagination<T>): Pagination<T> {
    return structuredClone(pagination);
}
import {
    buildCrmCacheKey,
    clearCrmCache,
    clearCrmCacheKey,
    getCrmCacheEntry,
    setCrmCacheEntry,
} from '@/composables/useCrmCache';

type GetCrmPlusOptions = Record<string, unknown> & {
    force?: boolean;
};

type GetCrmPlusResult = {
    fromCache: boolean;
};

export const useCrm = () => {
    const users = useState<Pagination<User> | null>('users', () => null);
    const institutions = useState<Pagination<CrmInstitution> | null>('crmInstitutions', () => null);
    const count = useState<number>('userCount', () => 0);
    const institutionsCount = useState<number>('crmInstitutionsCount', () => 0);
    const trashCount = useState<number>('userTrashCount', () => 0);
    const { $apifetch } = useNuxtApp();

    async function getCrmPlus(
        page = 1,
        perPage = 15,
        options: GetCrmPlusOptions = {},
    ): Promise<GetCrmPlusResult> {
        const { force = false, deleted = false, ...filters } = options;
        const requestParams = { deleted, ...filters };
        const cacheKey = buildCrmCacheKey(page, perPage, requestParams, 'users');

        if (!force) {
            const cached = getCrmCacheEntry(cacheKey);
            if (cached?.users) {
                users.value = clonePagination(cached.users);
                count.value = cached.count;
                trashCount.value = cached.trashCount ?? 0;

                return { fromCache: true };
            }
        }

        const response = await $apifetch('api/crm', {
            params: {
                page,
                perPage,
                deleted,
                ...filters,
            },
        });

        users.value = clonePagination(response.users);
        count.value = response.count;
        trashCount.value = response.trashed_count;

        setCrmCacheEntry(cacheKey, {
            users: clonePagination(response.users),
            count: response.count,
            trashCount: response.trashed_count,
            cachedAt: Date.now(),
        });

        return { fromCache: false };
    }

    async function getCrmInstitutions(
        page = 1,
        perPage = 15,
        options: GetCrmPlusOptions = {},
    ): Promise<GetCrmPlusResult> {
        const { force = false, ...filters } = options;
        const requestParams = { ...filters };
        const cacheKey = buildCrmCacheKey(page, perPage, requestParams, 'institutions');

        if (!force) {
            const cached = getCrmCacheEntry(cacheKey);
            if (cached?.institutions) {
                institutions.value = clonePagination(cached.institutions);
                institutionsCount.value = cached.count;

                return { fromCache: true };
            }
        }

        const response = await $apifetch('api/crm/institutions', {
            params: {
                page,
                perPage,
                ...filters,
            },
        });

        institutions.value = clonePagination(response.institutions);
        institutionsCount.value = response.count;

        setCrmCacheEntry(cacheKey, {
            institutions: clonePagination(response.institutions),
            count: response.count,
            cachedAt: Date.now(),
        });

        return { fromCache: false };
    }

    async function createInstitutionSubscription(
        institutionId: number,
        formula: 'institution_monthly_150' | 'institution_yearly_1500',
    ) {
        return await $apifetch(`api/crm/institutions/${institutionId}/subscription`, {
            method: 'POST',
            body: { formula },
        });
    }

    function invalidateCrmCacheKey(
        page: number,
        perPage: number,
        params: Record<string, unknown>,
        entity: 'users' | 'institutions' = 'users',
    ) {
        clearCrmCacheKey(buildCrmCacheKey(page, perPage, params, entity));
    }

    const crmUser = async (formData) => {
        return await $apifetch('/api/crm/plus', {
            method: 'POST',
            body: formData,
        });
    };

    const updateCrmUser = async (id, formData) => {
        return await $apifetch(`/api/crm/${id}/update`, {
            method: 'PUT',
            body: formData,
        });
    };

    async function getCrmHistories(crmUserId: number) {
        const response = await $apifetch(`api/crm/${crmUserId}/histories`);
        return response.histories ?? [];
    }

    return {
        trashCount,
        users,
        institutions,
        count,
        institutionsCount,
        getCrmPlus,
        getCrmInstitutions,
        createInstitutionSubscription,
        invalidateCrmCacheKey,
        clearCrmCache,
        crmUser,
        updateCrmUser,
        getCrmHistories,
        buildCrmCacheKey,
    };
};
