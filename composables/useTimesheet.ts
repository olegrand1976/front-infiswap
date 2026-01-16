import { useState, useNuxtApp } from '#app';

export const useTimesheets = () => {
    const { $apifetch } = useNuxtApp();
    const error = useState('error', () => null);
    const loading = useState('loading', () => false);

    async function update(id, formData) {
        const response = await $apifetch(`api/institution/timesheets/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        update,
        error,
        loading,
    };
};
