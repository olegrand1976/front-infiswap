import { useState, useNuxtApp } from '#app';

export const useNursePatients = () => {
    const { $apifetch, $user } = useNuxtApp();
    const nursePatients = useState('nursePatientTypes', () => []);
    const error = useState('nursePatientError', () => null);
    const loading = useState('nursePatientLoading', () => false);

    async function fetchNursePatients() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`/api/nurses/${$user.nurse.id}/patients`, { method: 'GET' });
            console.log('Données récupérées :', response.patients);
            nursePatients.value = response.patients;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    async function searchNurse(form) {
        await $apifetch('/api/patients', { method: 'post', body: form });
    }

    return { nursePatients, error, loading, fetchNursePatients, searchNurse };
};
