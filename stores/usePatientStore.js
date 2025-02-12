import { defineStore } from 'pinia';

export const usePatientStore = defineStore('usePatientStore', () => {

  const submitForm = async (data) => {
    try {

        console.log('Données envoyées:', data);

        const { $apifetch } = useNuxtApp();

        await $apifetch('/api/', {
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
