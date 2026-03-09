/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useNuxtApp } from '#app';
import type { Institution, InstitutionService } from '~/lib/types';

type DataList = {
    data: any[];
    meta: any;
};

export const useInstitutionServices = () => {
    const { $apifetch } = useNuxtApp();
    const services = useState<DataList>('services', () => ({ data: [], meta: {} }));
    const count = useState<number>('servicesCount', () => 0);
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/institution/services/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            services.value = response;
        });
    }

    async function create(formData) {
        const response = await $apifetch('/api/institution/services', {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function getById(id: number) {
        return await $apifetch(`api/institution/services/${id}`);
    }

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/services/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    async function remove(id: number) {
        return await $apifetch(`api/institution/services/${id}`, {
            method: 'DELETE',
        });
    }

    return {
        count,
        error,
        loading,
        services,
        getAll,
        create,
        getById,
        update,
        remove,
    };
};

import { toast } from 'vue-sonner';

export const useInstitutions = () => {
    const { $apifetch } = useNuxtApp();
    const config = useRuntimeConfig();

    const institutions = useState<Institution[]>('institutions', () => []);
    const currentInstitution = useState<any>('currentInstitution', () => null);
    const error = useState<string | null>('institutionsError', () => null);
    const loading = useState<boolean>('institutionsLoading', () => false);
    const saving = useState<boolean>('institutionsSaving', () => false);
    const count = useState<number>('institutionsCount', () => 0);

    async function getInstitutions(page = 1, perPage = 15, options: Record<string, unknown> = {}) {
        return await $apifetch('api/admin/institutions', {
            params: {
                page,
                perPage,
                ...options,
            },
        }).then((response: any) => {
            institutions.value = response.institutions;
            count.value = response.count;
        });
    }

    async function get(id: number) {
        return await $apifetch(`api/admin/institutions/${id}`);
    }

    /**
     * Get current user's institution settings
     */
    async function getSettings() {
        try {
            loading.value = true;
            const response = await $apifetch('/api/institution/settings', {
                method: 'GET',
            });
            currentInstitution.value = response.data;
            return response.data;
        }
        catch (error: any) {
            console.error('Erreur lors du chargement de l\'institution:', error);
            toast.error('Impossible de charger les informations de l\'institution');
            throw error;
        }
        finally {
            loading.value = false;
        }
    }

    /**
     * Get the full URL for an institution logo
     */
    function getLogoUrl(logoPath: string | null | undefined): string | null {
        if (!logoPath) return null;

        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
            return logoPath;
        }

        return `${config.public.API_URL}/storage/${logoPath}`;
    }

    /**
     * Delete institution logo
     */
    async function deleteLogo() {
        try {
            await $apifetch('/api/institution/settings/logo', {
                method: 'DELETE',
            });
            if (currentInstitution.value) {
                currentInstitution.value.logo = null;
            }
            toast.success('Logo supprimé avec succès');
        }
        catch (error: any) {
            console.error('Erreur lors de la suppression du logo:', error);
            toast.error('Impossible de supprimer le logo');
            throw error;
        }
    }

    async function createOrUpdate(institution: Partial<Institution> | FormData) {
        if (institution instanceof FormData) {
            try {
                saving.value = true;
                const formDataEntries: Record<string, any> = {};
                for (const [key, value] of institution.entries()) {
                    if (value instanceof File) {
                        formDataEntries[key] = `File: ${value.name} (${value.size} bytes)`;
                    }
                    else {
                        formDataEntries[key] = value;
                    }
                }

                institution.append('_method', 'PUT');

                const response = await $apifetch('/api/institution/settings', {
                    method: 'POST',
                    body: institution,
                });

                currentInstitution.value = response.data;
                toast.success('Paramètres de l\'institution mis à jour avec succès');
                return response.data;
            }
            catch (error: any) {
                const errorMessage = error?.data?.message
                    || error?.data?.errors
                    || error?.message
                    || 'Impossible de mettre à jour les paramètres';
                toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
                throw error;
            }
            finally {
                saving.value = false;
            }
        }

        const dataToSend: Partial<Institution> = {};
        if (institution.name) dataToSend.name = institution.name;

        const isUpdate = !!institution.id;
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate
            ? `api/admin/institutions/${institution.id}`
            : 'api/admin/institutions';

        return await $apifetch(url, {
            method,
            body: dataToSend,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function syncUsers(institutionId: number, users: { user_id: number; role_id: number }[]) {
        const { $apifetch } = useNuxtApp();
        return await ($apifetch as any)(`api/admin/institutions/${institutionId}/users/sync`, {
            method: 'POST',
            body: { users },
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function syncServices(institutionId: number, services: Partial<InstitutionService>[]) {
        return await $apifetch(`api/admin/institutions/${institutionId}/services/sync`, {
            method: 'POST',
            body: { services },
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async function forceDelete(id: number) {
        await $apifetch(`api/admin/institutions/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                toast('Suppression réussie.');
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la suppression.');
            });
    }

    return {
        institutions,
        currentInstitution,
        error,
        loading,
        saving,
        count,
        get,
        getInstitutions,
        getSettings,
        createOrUpdate,
        deleteLogo,
        getLogoUrl,
        syncServices,
        syncUsers,
        forceDelete,
    };
};
