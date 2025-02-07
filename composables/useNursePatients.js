import { useState, useNuxtApp } from '#app';

export const useNursePatients = () => {
    const { $apifetch } = useNuxtApp();
    const nursePatients = useState('nursePatientTypes', () => []);
    const error = useState('nursePatientError', () => null);
    const loading = useState('nursePatientLoading', () => false);

    async function fetchNursePatients() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch('/api/nurses/27/patients', { method: 'GET' });
            console.log("Données récupérées :", response.patients);
            nursePatients.value = response;
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
