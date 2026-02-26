import { useState, useNuxtApp } from '#app';
import type { Pagination, User } from '~/lib/types';

export const useCrm = () => {
    const users = useState<Pagination<User> | null>('users', () => null);
    const count = useState<number>('userCount', () => 0);
    const trashCount = useState<number>('userTrashCount', () => 0);
    const { $apifetch } = useNuxtApp();

    async function getCrmPlus(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/crm', {
            params: {
                page: page,
                perPage: perPage,
                deleted: options.deleted ?? false,
                ...options,
            },
        }).then((response) => {
            users.value = response.users;
            count.value = response.count;
            trashCount.value = response.trashed_count;
        });
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

    return {
        trashCount,
        users,
        getCrmPlus,
        crmUser,
        updateCrmUser,
    };
};
