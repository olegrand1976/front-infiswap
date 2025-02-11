import { useState, useNuxtApp } from '#app';

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);
    const success = useState('replacementSuccess', () => false);

    const user = useState('user');
    console.log(user.value);

    const submitReplacement = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const cleanFormData = JSON.parse(JSON.stringify(formData));
            console.log('Données envoyées :', JSON.stringify(cleanFormData, null, 2));
            const response = await $apifetch('/api/replacements', {
                method: 'POST',
                body: JSON.stringify(cleanFormData, null, 2),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                success.value = true;
            }
        }
        catch (err) {
            error.value = err;
            console.error('Erreur API :', err);
        }
        finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        success,
        submitReplacement,
    };
};

export const useGetReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);

    async function fetchReplacements() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`/api/replacements`, { method: 'GET' });
            console.log('Données récupérées :', response.replacements);
            replacements.value = response.replacements;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { replacements, error, loading, fetchReplacements };
};
