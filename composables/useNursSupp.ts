import { useNuxtApp } from '#app';

export const useNursSupp = () => {
    const { $apifetch } = useNuxtApp();

    const createHistory = (payload: { description: string }) =>
        $apifetch('/api/nurs-tech-histories', {
            method: 'POST',
            body: payload,
        });

    const getAssurTypes = () => $apifetch('/api/nurs-assur/types');

    const createAssurHistory = (payload: { description: string; types: number[] }) =>
        $apifetch('/api/nurs-assur/histories', {
            method: 'POST',
            body: payload,
        });

    return {
        createHistory,
        getAssurTypes,
        createAssurHistory,
    };
};
