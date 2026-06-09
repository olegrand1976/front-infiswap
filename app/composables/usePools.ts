import { ref } from 'vue';
import type { User } from '~/lib/types';

export type PoolUser = User & { pivot?: { stars: number } };

export interface Pool {
    id: number;
    institution_id: number;
    name: string;
    description: string | null;
    users_count?: number;
    users?: PoolUser[];
    created_at: string;
    updated_at: string;
}

export const usePools = () => {
    const pools = ref<{ data: Pool[] }>({ data: [] });
    const pool = ref<Pool | null>(null);
    const loading = ref(false);

    const { $apifetch } = useNuxtApp();

    const getAll = async () => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/institution/pools');
            pools.value = response.data ? response : { data: response };
            return response;
        }
        catch (error) {
            console.error('Error fetching pools:', error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const getById = async (id: number) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${id}`);
            pool.value = response.data ?? response;
            return response;
        }
        catch (error) {
            console.error(`Error fetching pool ${id}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const getSuggestions = async (filter: 'all' | 'accepted' = 'all') => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/suggestions`, {
                params: { filter },
            });
            return response.data ?? response;
        }
        catch (error) {
            console.error(`Error fetching pool suggestions:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const create = async (data: Partial<Pool> & { user_ids?: number[] }) => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/institution/pools', {
                method: 'POST',
                body: data,
            });
            return response;
        }
        catch (error) {
            console.error('Error creating pool:', error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const update = async (id: number, data: Partial<Pool> & { user_ids?: number[] }) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${id}`, {
                method: 'PUT',
                body: data,
            });
            return response;
        }
        catch (error) {
            console.error(`Error updating pool ${id}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const remove = async (id: number) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${id}`, {
                method: 'DELETE',
            });
            return response;
        }
        catch (error) {
            console.error(`Error deleting pool ${id}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const addUsers = async (poolId: number, userIds: number[]) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${poolId}/users`, {
                method: 'POST',
                body: { user_ids: userIds },
            });
            return response;
        }
        catch (error) {
            console.error(`Error adding users to pool ${poolId}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const removeUsers = async (poolId: number, userIds: number[]) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${poolId}/users`, {
                method: 'DELETE',
                body: { user_ids: userIds },
            });
            return response;
        }
        catch (error) {
            console.error(`Error removing users from pool ${poolId}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    const updateStars = async (poolId: number, userId: number, stars: number) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/institution/pools/${poolId}/users/${userId}/stars`, {
                method: 'PUT',
                body: { stars },
            });
            return response;
        }
        catch (error) {
            console.error(`Error updating stars for user ${userId} in pool ${poolId}:`, error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    };

    return {
        pools,
        pool,
        loading,
        getAll,
        getById,
        create,
        update,
        remove,
        addUsers,
        removeUsers,
        updateStars,
        getSuggestions,
    };
};
