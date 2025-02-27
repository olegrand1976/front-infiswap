import { useNuxtApp } from '#app';

export const submitContact = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact',
        { method: 'post', body: formData },
    );
};
