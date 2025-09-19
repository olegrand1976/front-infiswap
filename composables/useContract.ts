import { useState, useNuxtApp } from '#app';

export const useContract = () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { $apifetch, $toast } = useNuxtApp();
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

    const signContract = async (contractId: number) => {
        const newWindow = window.open('', '_blank');
        try {
            const response = await $apifetch(`/api/contracts/${contractId}/sign`, {
                method: 'POST',
            });

            if (response.contract) {
                const index = contracts.value.findIndex(c => c.id === response.contract.id);
                if (index !== -1) {
                    contracts.value[index] = response.contract;
                }
            }

            if (response.signature_url && newWindow) {
                newWindow.location.href = response.signature_url;
            }
            else if (newWindow) {
                newWindow.close();
            }

            return response;
        }
        catch (error) {
            console.error('Erreur lors de la signature:', error);
            if (newWindow) newWindow.close();
            throw error;
        }
    };

    const viewPdf = async (contractId: number) => {
        if (!contractId) return;

        const newWindow = window.open();
        if (!newWindow) {
            alert('Impossible d’ouvrir le PDF, vérifiez votre bloqueur de popups.');
            return;
        }

        newWindow.document.write(`
            <html>
                <head><title>Chargement PDF...</title></head>
                <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
                    <h3>Chargement du PDF, veuillez patienter...</h3>
                </body>
            </html>
        `);

        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`/api/contracts/${contractId}/view-pdf`, {
                responseType: 'blob',
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            newWindow.document.body.innerHTML = `
                <iframe src="${url}" frameborder="0" style="width:100%;height:100vh"></iframe>
            `;
        }
        catch (err) {
            console.error('Erreur lors de la lecture du PDF:', err);
            newWindow.document.body.innerHTML = `<h3>Erreur lors du chargement du PDF</h3>`;
            error.value = err.message || 'Erreur lors de la génération du PDF';
        }
        finally {
            loading.value = false;
        }
    };

    const update = async (id: number, payload: Record<string, any>) => {
        return await $apifetch(`/api/contracts/${id}`, {
            method: 'PUT',
            body: payload,
        });
    };

    async function forceDelete(contractId: number) {
        await $apifetch(`/api/contracts/${contractId}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    const getById = async (id: number) => {
        return await $apifetch(`/api/contracts/${id}`);
    };

    return {
        count,
        contracts,
        create,
        getContracts,
        loading,
        error,
        signContract,
        viewPdf,
        update,
        forceDelete,
        getById,
    };
};
