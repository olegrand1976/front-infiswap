import { useNuxtApp } from '#app';

export const useCrm = () => {
    const { $apifetch } = useNuxtApp();

    const crmUser = async (formData) => {
        return await $apifetch('/api/crm', {
            method: 'POST',
            body: formData,
        });
    };

    const updateCrmUser = async (id, formData) => {
        return await $apifetch(`/api/crm/${id}/update`, {
            method: 'PUT',
            body: formData,
        });
    };

    return {
        crmUser,
        updateCrmUser,
    };
};
