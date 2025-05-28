export const useHome = () => {
    const { $apifetch } = useNuxtApp();

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

    async function getSpecifiedHome(filter: 'active' | 'notActive' | null = null) {
        const params: Record<string, string> = {};
        if (filter !== null) {
            params.filter = filter;
        }

        return await $apifetch('/api/admin/home', { params });
    };

    async function get(home: number) {
        return await $apifetch(`/api/admin/home/${home}`);
    }

    return {
        create,
        get,
        getSpecifiedHome,
    };
};
