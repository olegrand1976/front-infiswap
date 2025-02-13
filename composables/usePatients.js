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
                headers: {
                    'Content-Type': 'application/json',
                },
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