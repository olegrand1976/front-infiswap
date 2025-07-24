import { useState, useNuxtApp } from '#app';

export const useTutorials = () => {
    const { $apifetch } = useNuxtApp();
    const tutorials = useState('tutorials', () => []);
    const count = useState<number>('tutorialsCount', () => 0);

    async function createTutorial(formData) {
        const response = await $apifetch(`/api/admin/tutorials/store`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

    async function fetchTutorials(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/admin/tutorials/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            tutorials.value = response.tutorials;
            count.value = response.count;
        });
    }

    return {
        createTutorial,
        fetchTutorials,
        tutorials,
        count,
    };
};
