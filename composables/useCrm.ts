import { useState, useNuxtApp } from '#app';
import type { Pagination, User } from '~/lib/types';

export const useCrm = () => {
    const users = useState<Pagination<User> | null>('users', () => null);
    const count = useState<number>('userCount', () => 0);
    const { $apifetch } = useNuxtApp();

    async function getCrmPlus(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/crm', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            users.value = response.users;
            count.value = response.count;
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
        users,
        getCrmPlus,
        crmUser,
        updateCrmUser,
    };
};
