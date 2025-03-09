import { useState, useNuxtApp } from '#app';

export const useCareTypes = () => {
    const { $apifetch } = useNuxtApp();
    const careTypes = useState('careTypes', () => []);
    const error = useState('careTypesError', () => null);
    const loading = useState('careTypesLoading', () => false);

    async function fetchCareTypes() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch('/api/care-types', { method: 'GET' });
            careTypes.value = response.care_types;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { careTypes, error, loading, fetchCareTypes };
};
