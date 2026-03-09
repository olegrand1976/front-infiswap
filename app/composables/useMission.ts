/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';

type MissionList = {
    data: any[];
    meta: any;
};

export const useMissions = () => {
    const { $apifetch } = useNuxtApp();
    const missions = useState<MissionList>('missions', () => ({ data: [], meta: {} }));
    const count = useState<number>('missionsCount', () => 0);
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function create(formData) {
        const response = await $apifetch(`/api/institution/missions`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/missions/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            missions.value = response;
        });
    }

    async function getById(id: number) {
        return await $apifetch(`api/institution/missions/${id}`);
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/missions/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    async function remove(id: number) {
        return await $apifetch(`api/institution/missions/${id}`, {
            method: 'DELETE',
        });
    }

    return {
        missions,
        count,
        create,
        getAll,
        getById,
        update,
        remove,
        error,
        loading,
    };
};

export const useMissionResponses = () => {
    const { $apifetch } = useNuxtApp();
    const responses = useState<MissionList>('missionResponses', () => ({ data: [], meta: {} }));
    const count = useState<number>('missionResponsesCount', () => 0);
    const error = useState('missionResponsesError', () => null);
    const loading = useState('missionResponsesLoading', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('/api/institution/missions/responses', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            responses.value = response;
        });
    }

    async function apply(formData) {
        const response = await $apifetch(`/api/institution/missions/responses`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getByMission(id, page = 1, perPage = 25, options = {}) {
        return await $apifetch(`/api/institution/missions/responses/${id}`, {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            responses.value = response;
        });
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/missions/responses/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        responses,
        count,
        getAll,
        getByMission,
        update,
        apply,
        error,
        loading,
    };
};

export const useMissionInvoices = () => {
    const { $apifetch } = useNuxtApp();
    const invoices = useState<MissionList>('invoices', () => ({ data: [], meta: {} }));
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/mission-invoices/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            invoices.value = response;
        });
    }

    async function create(formData) {
        const response = await $apifetch(`/api/institution/mission-invoices`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    const viewPdf = async (
        invoiceId: number,
        preview: boolean = true,
    ): Promise<File | void> => {
        if (!invoiceId) return;

        let newWindow: Window | null = null;

        if (preview) {
            newWindow = window.open();
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
        }

        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(
                `/api/institution/mission-invoices/${invoiceId}/view-pdf`,
                { responseType: 'blob' },
            );

            const blob = new Blob([response], { type: 'application/pdf' });

            if (!preview) {
                return new File(
                    [blob],
                    `facture-${invoiceId}.pdf`,
                    { type: 'application/pdf' },
                );
            }

            const url = URL.createObjectURL(blob);

            if (newWindow) {
                newWindow.document.body.innerHTML = `
                    <iframe src="${url}" frameborder="0" style="width:100%;height:100vh"></iframe>
                `;
            }
        }
        catch (err: any) {
            console.error('Erreur lors de la lecture du PDF:', err);

            if (newWindow) {
                newWindow.document.body.innerHTML = `<h3>Erreur lors du chargement du PDF</h3>`;
            }

            error.value = err.message || 'Erreur lors de la génération du PDF';
        }
        finally {
            loading.value = false;
        }
    };

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/mission-invoices/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        invoices,
        error,
        loading,
        create,
        getAll,
        viewPdf,
        update,
    };
};

export const useMissionTemplates = () => {
    const { $apifetch } = useNuxtApp();
    const templates = useState<any[]>('missionTemplates', () => []);
    const error = useState('missionTemplatesError', () => null);
    const loading = useState('missionTemplatesLoading', () => false);

    async function getAll() {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apifetch('/api/institution/mission-templates', {
                method: 'GET',
            });
            templates.value = response.data || [];
            return response;
        }
        catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement des templates';
            throw err;
        }
        finally {
            loading.value = false;
        }
    }

    async function create(formData: any) {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apifetch('/api/institution/mission-templates', {
                method: 'POST',
                body: formData,
            });
            await getAll();
            return response;
        }
        catch (err: any) {
            error.value = err.message || 'Erreur lors de la création du template';
            throw err;
        }
        finally {
            loading.value = false;
        }
    }

    async function getById(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apifetch(`/api/institution/mission-templates/${id}`, {
                method: 'GET',
            });
            return response;
        }
        catch (err: any) {
            error.value = err.message || 'Erreur lors du chargement du template';
            throw err;
        }
        finally {
            loading.value = false;
        }
    }

    async function update(id: number, formData: any) {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apifetch(`/api/institution/mission-templates/${id}`, {
                method: 'PUT',
                body: formData,
            });
            await getAll();
            return response;
        }
        catch (err: any) {
            error.value = err.message || 'Erreur lors de la mise à jour du template';
            throw err;
        }
        finally {
            loading.value = false;
        }
    }

    async function remove(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await $apifetch(`/api/institution/mission-templates/${id}`, {
                method: 'DELETE',
            });
            await getAll();
            return response;
        }
        catch (err: any) {
            error.value = err.message || 'Erreur lors de la suppression du template';
            throw err;
        }
        finally {
            loading.value = false;
        }
    }

    return {
        templates,
        error,
        loading,
        getAll,
        create,
        getById,
        update,
        remove,
    };
};
