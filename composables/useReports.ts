import { useState, useNuxtApp } from '#app';

export const useReports = () => {
    const { $apifetch } = useNuxtApp();

    const reports = useState('reports', () => null);
    const error = useState('reportsError', () => null);
    const loading = useState('loading', () => false);

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

    return {
        loading,
        reports,
        getReports,
    };
};
