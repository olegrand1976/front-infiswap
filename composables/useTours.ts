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

export const usePatient = () => {
    const { $apifetch } = useNuxtApp();

    // Utilisation de useState au lieu de ref
    const patient = useState('patient', () => null);
    const patientLoading = useState('patientLoading', () => false);
    const patientError = useState('patientError', () => null);
    const user = useUser();

    const fetchPatient = async (patientId, startDate: string, endDate: string) => {
        patientLoading.value = true;
        patientError.value = null;
        try {
            const params = new URLSearchParams({
                userId: user.value.id.toString(),
                startDate: startDate,
                endDate: endDate,
            }).toString();

            const response = await $apifetch(`/api/tours/${patientId}?${params}`, { method: 'GET' });
            console.log('data is ', response);
            patient.value = response;
        }
        catch (err) {
            patientError.value = err;
        }
        finally {
            patientLoading.value = false;
        }
    };

    return { patient, patientError, patientLoading, fetchPatient };
};

export const deleteTour = async (patientId, visitId) => {
    const { $apifetch } = useNuxtApp();
    const { $toast } = useNuxtApp();

    await $apifetch(`/api/tours/${patientId}/${visitId}/delete`, { method: 'DELETE' }).then(() => {
        setTimeout(() => {
            reloadNuxtApp({ persistState: true });
        }, 500);

        $toast({
            description: 'Suppression effectuée',
        });
    });
};
