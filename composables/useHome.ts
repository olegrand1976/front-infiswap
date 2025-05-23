import { useNuxtApp } from '#app';

interface HomeText {
    id?: number;
    title: string;
    description: string;
    image?: string | File;
    active: boolean;
}
export const useHome = () => {
    const { $apifetch } = useNuxtApp();

    async function store(home: HomeText) {
        return await $apifetch('/api/home', {
            method: 'POST',
            body: home,
        });
    }

    async function getCollection(page = 1, perPage = 25) {
        return await $apifetch(`/api/home?page=${page}&perPage=${perPage}`);
    }

    async function get(id: number) {
        return await $apifetch(`/api/home/${id}`);
    }

    async function update(home: HomeText) {
        return await $apifetch(`/api/home/${home.id}`, { method: 'PUT' });
    }

    async function destroy(id: number) {
        return await $apifetch(`/api/home/${id}`, { method: 'DELETE' });
    }

    return {
        store,
        getCollection,
        get,
        update,
        destroy,
    };
};
