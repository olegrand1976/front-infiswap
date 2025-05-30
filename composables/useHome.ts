import type { Pagination } from '~/lib/types';

export const useHome = () => {
    const { $apifetch } = useNuxtApp();
    const prefix = '/api/admin/homes';
    const homes = useState<Pagination<HomeType>>('homeData', () => null);
    async function create(title: string, description: string, image: File) {
        return await $apifetch(prefix, {
            method: 'POST',
            body: {
                title: title,
                description: description,
                image: image,
            },
        });
    }

    async function getSpecifiedHome(
        options = {},
    ) {
        const response = await $apifetch(prefix, {
            ...options,
        });

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
        create,
        get,
        edit,
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
