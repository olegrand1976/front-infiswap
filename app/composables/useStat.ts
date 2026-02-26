import { useState, useNuxtApp } from '#app';

export const useStat = () => {
    const { $apifetch } = useNuxtApp();
    const stats = useState('stats', () => []);
    const count = useState<number>('count', () => 0);

    async function getStats(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/website/list', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            stats.value = response.stats;
            count.value = response.count;
        });
    }

    return {
        stats,
        count,
        getStats,
    };
};
