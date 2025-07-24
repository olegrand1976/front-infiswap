import { useNuxtApp } from '#app';

export const useTutorials = () => {
    const { $apifetch } = useNuxtApp();

    async function createTutorial(formData) {
        const response = await $apifetch(`/api/tutorials/store`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    return {
        createTutorial,
    };
};
