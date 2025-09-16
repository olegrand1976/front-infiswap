import { useState, useNuxtApp } from '#app';

export const useContract = () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { $apifetch } = useNuxtApp();
    const contracts = useState('contracts', () => []);
    const count = useState<number>('contractsCount', () => 0);

    const create = async (formData) => {
        return await $apifetch('/api/admin/contracts/create', {
            method: 'POST',
            body: formData,
        });
    };

    const getContracts = async (page = 1, perPage = 25, options = {}) => {
        return await $apifetch('api/admin/contracts/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            contracts.value = response.contracts;
            count.value = response.count;
        });
    };

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

    return {
        count,
        contracts,
        create,
        getContracts,
        generatePdf,
        loading,
        error,
    };
};
