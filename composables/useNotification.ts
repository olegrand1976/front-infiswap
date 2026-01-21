import { useState, useNuxtApp } from '#app';

export const useNotifications = () => {
    const { $apifetch } = useNuxtApp();
    const loading = useState('notifLoading', () => false);

    async function read(id, formData) {
        const response = await $apifetch(`/api/notifications/${id}`, {
            method: 'put',
            body: formData,
        });

        return response;
    }

    return {
        loading,
        read,
    };
};
