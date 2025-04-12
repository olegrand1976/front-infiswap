import { useState, useNuxtApp } from '#app';

export const useReports = () => {
    const { $apifetch, $toast } = useNuxtApp();

    const reports = useState('reports', () => null);
    const error = useState('reportsError', () => null);
    const loading = useState('reportsLoading', () => false);

    const getReports = async () => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/reports', { method: 'GET' });
            reports.value = response;
            return response;
        }
        catch (err) {
            error.value = err;
            console.error('[getReports] error:', err?.data ?? err);
            return null;
        }
        finally {
            loading.value = false;
        }
    };

    const createPreferences = async (formData) => {
        await $apifetch('/api/users/settings', { method: 'POST', body: formData }).then(() => {
            $toast({
                description: 'Succès',
            });
        }).catch(() => {
            $toast({
                variant: 'destructive',
                description: 'Une erreur est survenue lors de l\'enregistrement',
            });
        });
    };

    async function createNotifPreferences(formData) {
        return await $apifetch(`/api/users/settings/notification`, {
            method: 'post',
            body: formData,
        });
    };

    return {
        loading,
        reports,
        getReports,
        createPreferences,
        createNotifPreferences,
    };
};
