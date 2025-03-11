import { useState, useNuxtApp, reloadNuxtApp } from '#app';

export const searchNurse = () => {
    const { $apifetch } = useNuxtApp();

    const error = useState('patientError', () => null);
    const loading = useState('patientLoading', () => false);
    const success = useState('patientSuccess', () => false);

    const submitSearchNurse = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await $apifetch('/api/patients', {
                method: 'POST',
                body: formData,
            });

            success.value = true;
            return response;
        }
        catch (err) {
            error.value = err;
            console.error('Erreur API :', err);
            throw err;
        }
        finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        success,
        submitSearchNurse,
    };
};

export const createPatient = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/patients',
        { method: 'post', body: formData },
    );
};

export const detailPatient = (patientId) => {
    const { $apifetch } = useNuxtApp();

    const patient = useState('patient', () => []);
    const patientVisit = useState('patientVisit', () => []);

    async function fetchDetailPatient() {
        const response = await $apifetch(`/api/patients/${patientId}`, { method: 'GET' });
        patient.value = response.data;
    }

    async function fetchPatientVisit() {
        const response = await $apifetch(`/api/patients/${patientId}/visit_times`, { method: 'GET' });
        patientVisit.value = response.patient_visit_times;
    }

    return {
        patient,
        patientVisit,
        fetchDetailPatient,
        fetchPatientVisit,
    };
};

export const updatePatient = async (patientId: number, formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        body: formData,
    });
};

export const deletePatient = async (patientId) => {
    const { $apifetch } = useNuxtApp();
    const { $toast } = useNuxtApp();

    await $apifetch(`/api/patients/${patientId}`, { method: 'DELETE' }).then(() => {
        setTimeout(() => {
            reloadNuxtApp({ persistState: true });
        }, 500);

        $toast({
            description: 'Suppression effectuée',
        });
    });
};
