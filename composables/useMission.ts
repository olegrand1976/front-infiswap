import { useState, useNuxtApp } from '#app';

export const useMissions = () => {
    const { $apifetch } = useNuxtApp();
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function create(formData) {
        const response = await $apifetch(`/api/institution/missions`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    return {
        create,
        error,
        loading,
    };
};
