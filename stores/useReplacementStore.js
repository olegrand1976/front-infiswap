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
        }
        catch (error) {
            console.error('Échec de l\'envoi du formulaire:', error);
            errorMessage.value = 'Une erreur est survenue.';
        }
        finally {
        }
    };

    const changeStatus = async (response) => {
        try {
            console.log('Données envoyées:');

            const { $apifetch } = useNuxtApp();
            const apiUrl = `/api/replacement-responses/${response}/update-status?status=confirmed`;

            const res = await $apifetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Gestion de la réponse de l'API
            if (res.ok) {
                console.log('Statut mis à jour avec succès');
            }
            else {
                console.error('Échec de la mise à jour du statut');
            }
        }
        catch (error) {
            console.error('Échec de l\'envoi du formulaire:', error);
            errorMessage.value = 'Une erreur est survenue.';
        }
        finally {
            // Vous pouvez ajouter des actions de nettoyage ici si nécessaire
        }
    };

    return {
        submitForm,
        changeStatus,
    };
});
