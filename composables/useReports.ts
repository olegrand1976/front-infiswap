import { useState, useNuxtApp } from '#app';

export const useReports = () => {
    const { $apifetch } = useNuxtApp();

    const reports = useState('reports', () => null);
    const error = useState('reportsError', () => null);
    const loading = useState('reportsLoading', () => false);

    const getReports = async () => {
        try {
            const response = await $apifetch('/api/reports', { method: 'GET' });
            reports.value = response;

            return reports.value;
        }
        catch (err) {
            error.value = err;
            console.error(err);
        }
        finally {
            loading.value = false;
        }
    };

    return {
        reports,
        getReports,
    };
};
