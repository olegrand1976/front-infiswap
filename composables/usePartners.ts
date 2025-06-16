import { useNuxtApp } from '#app';

export const usePartners = () => {
    const { $apifetch } = useNuxtApp();

    const create = async (formData) => {
        return await $apifetch('/api/partners/create', {
            method: 'POST',
            body: formData,
        });
    };

    return {
        create,
    };
};
