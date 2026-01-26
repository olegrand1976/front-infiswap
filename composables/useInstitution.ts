/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';

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
