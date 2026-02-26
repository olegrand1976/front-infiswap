// import { useRouter } from 'vue-router';
import { useState, useNuxtApp } from '#app';

export const useTours = () => {
    const { $apifetch } = useNuxtApp();

    const user = useUser();
    const tours = useState('tours', () => []);
    const error = useState('toursError', () => null);
    const loading = useState('toursLoading', () => false);

    async function fetchTours(startDate: string, endDate: string) {
        loading.value = true;
        error.value = null;

        try {
            if (!user.value) {
                throw new Error('Utilisateur non connecté');
            }

            const params = new URLSearchParams({
                userId: user.value.id.toString(),
                startDate: startDate,
                endDate: endDate,
            }).toString();
            const response = await $apifetch(`/api/tours?${params}`, { method: 'GET' });
            tours.value = response.patient;
        }
        catch (err) {
            // error.value = err;
            console.log(err);
        }
        finally {
            loading.value = false;
        }
    }

    return { tours, error, loading, fetchTours };
};

export const deleteTour = async (patientId, visitId) => {
    const { $apifetch } = useNuxtApp();
    const { $toast } = useNuxtApp();

    try {
        await $apifetch(`/api/tours/${patientId}/${visitId}/delete`, {
            method: 'DELETE',
        });
        $toast({
            description: 'Suppression effectuée',
        });
        return true;
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
        $toast({
            description: 'Échec de la suppression',
            variant: 'destructive',
        });
        throw error;
    }
};
