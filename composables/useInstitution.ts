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

    return {
        count,
        error,
        loading,
        services,
        getAll,
    };
};
