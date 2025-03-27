import { useState, useNuxtApp } from '#app';

export const useNursePatients = () => {
    // const { $apifetch, $user } = useNuxtApp();
    const { $apifetch } = useNuxtApp();
    const nursePatients = useState('nursePatientTypes', () => []);
    const error = useState('nursePatientError', () => null);
    const loading = useState('nursePatientLoading', () => false);
    const user = useUser();

    async function fetchNursePatients() {
        loading.value = true;
        error.value = null;

        try {
            // const response = await $apifetch(`/api/nurses/${$user.nurse.id}/patients`, { method: 'GET' });
            const response = await $apifetch(`/api/nurses/${user.value.nurse.id}/patients`, { method: 'GET' });
            console.log('Données récupérées :', response.patients);
            nursePatients.value = response.patients.patients;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { nursePatients, error, loading, fetchNursePatients };
};
