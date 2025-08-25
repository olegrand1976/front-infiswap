import { useNuxtApp } from '#app';

export const useCrm = () => {
    const { $apifetch } = useNuxtApp();

    const crmUser = async (formData) => {
        return await $apifetch('/api/crm', {
            method: 'POST',
            body: formData,
        });
    };

    return {
        crmUser,
    };
};
