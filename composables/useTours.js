// import { useRouter } from 'vue-router';
import { useState, useNuxtApp } from '#app';

export const useTours = () => {
    const { $apifetch } = useNuxtApp();

    const tours = useState('tours', () => []);
    const error = useState('toursError', () => null);
    const loading = useState('toursLoading', () => false);

    const nurseId = 1;
    // const startDate = '2025-03-06';
    // const endDate = '2025-03-26';

    async function fetchTours(startDate, endDate) {
        loading.value = true;
        error.value = null;

        try {
            const params = new URLSearchParams({
                nurseId: nurseId,
                startDate: startDate,
                endDate: endDate,
            }).toString();

            const response = await $apifetch(`/api/tours?${params}`, { method: 'GET' });

            // console.log('Données récupérées:', response);
            tours.value = response.patient;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { tours, error, loading, fetchTours };
};
