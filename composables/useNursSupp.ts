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

    const submitContact = async (contactData) => {
        try {
            const { data, error } = await $apifetch('/api/nurstech/contact', {
                method: 'POST',
                body: contactData,
            });

            if (error?.value) {
                throw error.value?.data?.message || 'Une erreur est survenue.';
            }

            return data?.value || data;
        }
        catch (e) {
            throw e?.data?.message || e?.message || 'Une erreur est survenue.';
        }
    };

    const submitassurContact = async (contactData) => {
        try {
            const { data, error } = await $apifetch('/api/nursassur/contact', {
                method: 'POST',
                body: contactData,
            });

            if (error?.value) {
                throw error.value?.data?.message || 'Une erreur est survenue.';
            }

            return data?.value || data;
        }
        catch (e) {
            throw e?.data?.message || e?.message || 'Une erreur est survenue.';
        }
    };

    return {
        createHistory,
        getAssurTypes,
        createAssurHistory,
        submitContact,
        submitassurContact,
    };
};
