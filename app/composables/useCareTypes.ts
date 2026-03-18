/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';
import type { CareType } from '~/lib/types';

export const useCareTypes = () => {
    const { $apifetch } = useNuxtApp();
    const careTypes = useState('careTypes', () => []);
    const error = useState('careTypesError', () => null);
    const loading = useState('careTypesLoading', () => false);
    const count = useState<number>('careTypesCount', () => 0);
    const { $toast } = useNuxtApp();

    async function fetchCareTypes() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch('/api/care-types', { method: 'GET' });
            careTypes.value = response.care_types;
        }
        catch (err) {
            error.value = err?.message || String(err);
        }
        finally {
            loading.value = false;
        }
    }

    async function getCareTypes(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/admin/care-types', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            careTypes.value = response.care_types;
            count.value = response.count;
        });
    }

    async function createOrUpdate(careType: CareType) {
        const dataToSend: any = {};

        if (careType.name) dataToSend.name = careType.name;
        if (careType.duration !== null && careType.duration !== undefined) {
            dataToSend.duration = careType.duration;
        }
        if (careType.price !== null && careType.price !== undefined) {
            dataToSend.price = careType.price;
        }

        const isUpdate = !!careType.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate
            ? `api/care-types/${careType.id}`
            : 'api/care-types';

        return await $apifetch(url, {
            method,
            body: dataToSend,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async function get(careType: number) {
        return await $apifetch(`api/care-types/${careType}`);
    }

    async function forceDelete(careType: number) {
        await $apifetch(`api/care-types/${careType}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    return { careTypes, error, loading, count, get, fetchCareTypes, getCareTypes, createOrUpdate, forceDelete };
};
