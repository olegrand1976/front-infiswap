import type { Pagination, HomeType } from '~/lib/types';

export const useHome = () => {
    const { $apifetch } = useNuxtApp();
    const prefix = '/api/admin/homes';
    const homes = useState<Pagination<HomeType>>('homeData', () => null);

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
        const response = await $apifetch(prefix, { ...options });
        homes.value = response;
        return response;
    }

    async function get(home: number) {
        return await $apifetch(`${prefix}/${home}`);
    }

    async function edit(id: number, options = {}) {
        return await $apifetch(`${prefix}/${id}`, {
            method: 'PUT',
            body: { ...options },
        });
    }

    return {
        homes,
        createOrUpdate,
        get,
        edit,
        getSpecifiedHome,
    };
};
