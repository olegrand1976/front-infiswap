/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'vue-sonner';
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
    const error = useState('institutionError', () => null);
    const loading = useState('institutionLoading', () => false);

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

export const useInstitutions = () => {
    const { $apifetch } = useNuxtApp();

    const institutions = useState<Institution[]>('institutions', () => []);
    const currentInstitution = useState<any>('currentInstitution', () => null);
    const error = useState<string | null>('institutionsError', () => null);
    const loading = useState<boolean>('institutionsLoading', () => false);
    const saving = useState<boolean>('institutionsSaving', () => false);
    const count = useState<number>('institutionsCount', () => 0);

    async function getInstitutions(page = 1, perPage = 15, options: Record<string, unknown> = {}) {
        try {
            loading.value = true;
            const response = await $apifetch('api/admin/institutions', {
                params: {
                    page,
                    perPage,
                    ...options,
                },
            });

            institutions.value = response.institutions || [];
            count.value = response.count || 0;

            return response;
        }
        catch (error: any) {
            console.error('Erreur lors de la récupération des institutions:', error);
            institutions.value = [];
            count.value = 0;
            throw error;
        }
        finally {
            loading.value = false;
        }
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

    const { getStorageUrl } = useStorageUrl();

    function getLogoUrl(logoPath: string | null | undefined): string | null {
        return getStorageUrl(logoPath);
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

        try {
            const response = await $apifetch(url, {
                method,
                body: dataToSend,
                headers: { 'Content-Type': 'application/json' },
            });

            if (isUpdate) {
                toast.success('Institution modifiée avec succès');
            }

            return response;
        }
        catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Erreur lors de l\'opération';
            toast.error(errorMessage);
            throw error;
        }
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
        try {
            await $apifetch(`api/admin/institutions/${id}`, {
                method: 'DELETE',
            });
            institutions.value = institutions.value.filter(institution => institution.id !== id);
            if (count.value > 0) {
                count.value -= 1;
            }
            toast.success('Suppression réussie.');
        }
        catch (error: any) {
            toast.error(error?.data?.message || 'Une erreur est survenue lors de la suppression.');
            throw error;
        }
    }

    async function validateInstitution(id: number) {
        try {
            const response = await $apifetch(`api/admin/institutions/${id}/validate`, {
                method: 'POST',
            });
            toast.success('Institution validée avec succès');
            return response;
        }
        catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de la validation');
            throw error;
        }
    }

    async function rejectInstitution(id: number) {
        try {
            const response = await $apifetch(`api/admin/institutions/${id}/reject`, {
                method: 'POST',
            });
            toast.success('Institution rejetée');
            return response;
        }
        catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors du rejet');
            throw error;
        }
    }

    async function updateStatus(id: number, status: 'pending' | 'active' | 'rejected') {
        try {
            const response = await $apifetch(`api/admin/institutions/${id}/status`, {
                method: 'PUT',
                body: { status },
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success('Statut mis à jour avec succès');
            return response;
        }
        catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de la mise à jour du statut');
            throw error;
        }
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
        validateInstitution,
        rejectInstitution,
        updateStatus,
    };
};

export const useInstitutionMembers = () => {
    const { $apifetch } = useNuxtApp();
    const members = useState<any[]>('institutionMembers', () => []);
    const roles = useState<any[]>('institutionRoles', () => []);
    const loading = useState<boolean>('institutionMembersLoading', () => false);
    const saving = useState<boolean>('institutionMembersSaving', () => false);

    async function getMembers() {
        try {
            loading.value = true;
            const response = await $apifetch('/api/institution/members');
            members.value = response.data;
            return response.data;
        }
        catch (error: any) {
            console.error('Erreur lors du chargement des membres:', error);
            throw error;
        }
        finally {
            loading.value = false;
        }
    }

    async function getAvailableRoles() {
        try {
            const response = await $apifetch('/api/institution/members/roles');
            roles.value = response.data;
            return response.data;
        }
        catch (error: any) {
            console.error('Erreur lors du chargement des rôles:', error);
            throw error;
        }
    }

    async function addMember(email: string, role: string, firstname?: string, lastname?: string, gender?: string) {
        try {
            saving.value = true;
            const response = await $apifetch('/api/institution/members', {
                method: 'POST',
                body: { email, role, firstname, lastname, gender },
            });
            toast.success('Membre ajouté avec succès');
            await getMembers();
            return response;
        }
        catch (error: any) {
            const message = error?.data?.message || 'Erreur lors de l\'ajout du membre';
            toast.error(message);
            throw error;
        }
        finally {
            saving.value = false;
        }
    }

    async function updateMemberRole(userId: number | string, role: string) {
        try {
            saving.value = true;
            const response = await $apifetch(`/api/institution/members/${userId}`, {
                method: 'PUT',
                body: { role },
            });
            toast.success('Rôle mis à jour');
            const index = members.value.findIndex(m => m.id === userId);
            if (index !== -1) {
                members.value[index].institution_user_roles = [{
                    role: { name: role },
                }];
            }
            return response;
        }
        catch (error: any) {
            toast.error('Erreur lors de la mise à jour du rôle');
            throw error;
        }
        finally {
            saving.value = false;
        }
    }

    async function getMember(userId: number | string) {
        try {
            const response = await $apifetch(`/api/institution/members/${userId}`);
            return response.data;
        }
        catch (error: any) {
            toast.error('Erreur lors de la récupération du membre');
            throw error;
        }
    }

    async function updateMember(userId: number | string, data: any) {
        try {
            saving.value = true;
            const response = await $apifetch(`/api/institution/members/${userId}`, {
                method: 'PUT',
                body: data,
            });
            toast.success('Membre mis à jour avec succès');
            await getMembers();
            return response;
        }
        catch (error: any) {
            const message = error?.data?.message || 'Erreur lors de la mise à jour';
            toast.error(message);
            throw error;
        }
        finally {
            saving.value = false;
        }
    }

    async function removeMember(userId: number) {
        try {
            saving.value = true;
            const response = await $apifetch(`/api/institution/members/${userId}`, {
                method: 'DELETE',
            });
            toast.success('Membre retiré');

            members.value = members.value.filter(m => m.id !== userId);
            return response;
        }
        catch (error: any) {
            const message = error?.data?.message || 'Erreur lors de la suppression';
            toast.error(message);
            throw error;
        }
        finally {
            saving.value = false;
        }
    }

    return {
        members,
        roles,
        loading,
        saving,
        getMembers,
        getAvailableRoles,
        addMember,
        updateMemberRole,
        removeMember,
        getMember,
        updateMember,
    };
};
