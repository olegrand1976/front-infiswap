import { useNuxtApp } from '#app';

export const useNursSupp = () => {
    const { $apifetch } = useNuxtApp();

    const createHistory = (payload: { description: string }) =>
        $apifetch('/api/nurstech-histories', {
            method: 'POST',
            body: payload,
        });

    const getAssurTypes = () => $apifetch('/api/nursassur/types');

    const createAssurHistory = (payload: { description: string; types: number[] }) =>
        $apifetch('/api/nursassur/histories', {
            method: 'POST',
            body: payload,
        });

    return {
        createHistory,
        getAssurTypes,
        createAssurHistory,
    };
};
