import { useNuxtApp } from '#app';

export const useService = () => {
    const { $apifetch } = useNuxtApp();

    const getAssurTypes = () => $apifetch('/api/nursassur/types');

    const submitContact = async (contactData) => {
        try {
            const { data, error } = await $apifetch('/api/contact/product', {
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

    const createHistory = (payload: { product: string; description: string; types?: number[] }) =>
        $apifetch('/api/products/histories', {
            method: 'POST',
            body: payload,
        });

    return {
        createHistory,
        getAssurTypes,
        submitContact,
    };
};
