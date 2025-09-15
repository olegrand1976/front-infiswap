import { ref } from 'vue';

export const useContract = () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { $apifetch } = useNuxtApp();

    const generatePdf = async (userId: number) => {
        if (!userId) return;
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch('/api/contracts/pdf', {
                params: { user_id: userId },
                responseType: 'blob',
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
        catch (err) {
            console.error(err);
            error.value = err.message || 'Erreur lors de la génération du PDF';
        }
        finally {
            loading.value = false;
        }
    };

    return { generatePdf, loading, error };
};
