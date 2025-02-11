import { defineStore } from 'pinia';

export const useReplacementStore = defineStore('useReplacementStore', () => {

  const submitForm = async (data) => {
    try {

        console.log('Données envoyées:', data);

        const { $apifetch } = useNuxtApp();

        await $apifetch('/api/replacement-responses/send', {
            method: 'POST',
            body: data, // Convertir en JSON
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Échec de l\'envoi du formulaire:', error);
        errorMessage.value = 'Une erreur est survenue.';
    } finally {
    }
};

    return {
        submitForm,
    };
});
