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
                nurseId: user.value.id.toString(),
                startDate: startDate,
                endDate: endDate,
            }).toString();
            const response = await $apifetch(`/api/tours?${params}`, { method: 'GET' });
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

export const useCareType = () => {
    const { $apifetch } = useNuxtApp();

    // Utilisation de useState au lieu de ref
    const careType = useState('careType', () => null);
    const careTypeLoading = useState('careTypeLoading', () => false);
    const careTypeError = useState('careTypeError', () => null);

    const fetchCareType = async (patientId) => {
        careTypeLoading.value = true;
        careTypeError.value = null;
        try {
            const response = await $apifetch(`/api/patients/${patientId}/care-type`, { method: 'GET' });
            careType.value = response;
        }
        catch (err) {
            careTypeError.value = err;
        }
        finally {
            careTypeLoading.value = false;
        }
    };

    return { careType, careTypeLoading, careTypeError, fetchCareType };
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
                nurseId: user.value.id.toString(),
                startDate: startDate,
                endDate: endDate,
            }).toString();

            const response = await $apifetch(`/api/tours/tour-defini/${patientId}?${params}`, { method: 'GET' });
            // console.log('data ', response);
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
