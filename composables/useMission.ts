import { useState, useNuxtApp } from '#app';

export const useMissions = () => {
    const { $apifetch } = useNuxtApp();
    const missions = useState('missions', () => []);
    const count = useState<number>('missionsCount', () => 0);
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function create(formData) {
        const response = await $apifetch(`/api/institution/missions`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/missions/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            missions.value = response;
        });
    }

    return {
        missions,
        count,
        create,
        getAll,
        error,
        loading,
    };
};
