import type { Pagination } from '~/lib/types';

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

        const method = homeData.id ? 'PUT' : 'POST';
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

    return {
        homes,
        createOrUpdate,
        get,
        getSpecifiedHome,
    };
};

export type HomeType = {
    id?: string;
    title?: string;
    description?: string;
    active?: boolean | number;
    image?: string | File;
};
