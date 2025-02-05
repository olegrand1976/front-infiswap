import { useState, useNuxtApp } from '#app';

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);
    const success = useState('replacementSuccess', () => false);

    const submitReplacement = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const cleanFormData = JSON.parse(JSON.stringify(formData));
            console.log("Données envoyées :", JSON.stringify(cleanFormData, null, 2));
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
