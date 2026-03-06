/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';
import type { Institution, InstitutionService } from '~/lib/types';

type DataList = {
    data: any[];
    meta: any;
};

export const useInstitutionServices = () => {
    const { $apifetch } = useNuxtApp();
    const services = useState<DataList>('services', () => ({ data: [], meta: {} }));
    const count = useState<number>('servicesCount', () => 0);
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/services/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            services.value = response;
        });
    }

    async function create(formData) {
        const response = await $apifetch('/api/institution/services', {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getById(id: number) {
        return await $apifetch(`api/institution/services/${id}`);
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/services/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    async function remove(id: number) {
        return await $apifetch(`api/institution/services/${id}`, {
            method: 'DELETE',
        });
    }

    return {
        count,
        error,
        loading,
        services,
        getAll,
        create,
        getById,
        update,
        remove,
    };
};

export const useInstitutions = () => {
    const { $apifetch, $toast } = useNuxtApp();

    const institutions = useState<Institution[]>('institutions', () => []);
    const error = useState<string | null>('institutionsError', () => null);
    const loading = useState<boolean>('institutionsLoading', () => false);
    const count = useState<number>('institutionsCount', () => 0);

    async function getInstitutions(page = 1, perPage = 15, options: Record<string, unknown> = {}) {
        return await $apifetch('api/admin/institutions', {
            params: {
                page,
                perPage,
                ...options,
            },
        }).then((response: any) => {
            institutions.value = response.institutions;
            count.value = response.count;
        });
    }

    async function get(id: number) {
        return await $apifetch(`api/admin/institutions/${id}`);
    }

    async function createOrUpdate(institution: Partial<Institution>) {
        const dataToSend: Partial<Institution> = {};
        if (institution.name) dataToSend.name = institution.name;

        const isUpdate = !!institution.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate
            ? `api/admin/institutions/${institution.id}`
            : 'api/admin/institutions';

        return await $apifetch(url, {
            method,
            body: dataToSend,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function syncUsers(institutionId: number, users: { user_id: number; role_id: number }[]) {
        const { $apifetch } = useNuxtApp();
        return await ($apifetch as any)(`api/admin/institutions/${institutionId}/users/sync`, {
            method: 'POST',
            body: { users },
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function syncServices(institutionId: number, services: Partial<InstitutionService>[]) {
        return await $apifetch(`api/admin/institutions/${institutionId}/services/sync`, {
            method: 'POST',
            body: { services },
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function forceDelete(id: number) {
        await $apifetch(`api/admin/institutions/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                $toast({ description: 'Suppression réussie.' });
            })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    return {
        institutions,
        error,
        loading,
        count,
        get,
        getInstitutions,
        createOrUpdate,
        syncServices,
        syncUsers,
        forceDelete,
    };
};
