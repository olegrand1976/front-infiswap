import type { Pagination, HomeType } from '~/lib/types';

export const useHome = () => {
    const { $apifetch } = useNuxtApp();
    const prefix = '/api/admin/homes';
    const homes = useState<Pagination<HomeType>>('homeData', () => null);
    const { $toast } = useNuxtApp();

    async function createOrUpdate(homeData: HomeType, image?: File) {
        const formData = new FormData();

        if (homeData.title) formData.append('title', homeData.title);
        if (homeData.description) formData.append('description', homeData.description);
        if (homeData.active !== undefined) formData.append('active', homeData.active.toString());

        if (image) {
            formData.append('image', image);
        }

        const method = 'POST';
        const url = homeData.id ? `${prefix}/${homeData.id}` : prefix;

        return await $apifetch(url, {
            method,
            body: formData,
        });
    }

    async function getSpecifiedHome(options = {}) {
        const response = await $apifetch(prefix, { query: options });
        homes.value = response;
        return response;
    }

    async function get(home: number) {
        return await $apifetch(`${prefix}/${home}`);
    }

    async function count() {
        return await $apifetch(`/api/home/count`);
    }

    async function edit(id: number, options = {}) {
        return await $apifetch(`${prefix}/update/${id}`, {
            method: 'PUT',
            body: { ...options },
        });
    }

    async function forceDelete(home: number) {
        await $apifetch(`${prefix}/${home}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    return {
        homes,
        createOrUpdate,
        get,
        edit,
        count,
        getSpecifiedHome,
        forceDelete,
    };
};
