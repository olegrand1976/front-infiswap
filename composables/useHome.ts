import type { Pagination } from '~/lib/types';

export const useHome = () => {
    const { $apifetch } = useNuxtApp();
    const homes = useState<Pagination<HomeType>>('homeData', () => null);
    async function create(title: string, description: string, image: File) {
        return await $apifetch('/api/admin/home', {
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
        const response = await $apifetch('/api/admin/home', {
            ...options,
        });

        homes.value = response;
        return response;
    }

    async function get(home: number) {
        return await $apifetch(`/api/admin/home/${home}`);
    }

    return {
        homes,
        create,
        get,
        getSpecifiedHome,
    };
};

export type HomeType = {
    id: string;
    title: string;
    description: string;
    active: boolean | number;
    image: string | File;
};
