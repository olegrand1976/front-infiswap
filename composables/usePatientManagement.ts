export function usePatientManagement() {
    const { $apifetch, $toast } = useNuxtApp();

    const error = useState('patientError', () => null);
    const loading = useState('patientLoading', () => false);
    const success = useState('patientSuccess', () => false);

    const downloadDocument = async (id: number) => {
        try {
            loading.value = true;
            const response = await $apifetch(`/api/patients/documents/${id}/download`);

            const link = document.createElement('a');
            link.href = URL.createObjectURL(response);
            link.setAttribute('download', `infiswap_${Date.now()}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch {
            $toast({
                variant: 'destructive',
                description: 'Erreur lors de la tentative de téléchargement du document',
            });
        }
        finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        success,
        downloadDocument,
    };
}
