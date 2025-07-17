import { useNuxtApp } from '#app';

export const submitContact = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact',
        { method: 'post', body: formData },
    );
};

export function useContact() {
    const contacts = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const pagination = ref({});
    const { $apifetch } = useNuxtApp();
    const count = useState<number>('careTypesCount', () => 0);

    // const fetchContacts = async (page: number = 1) => {
    //     loading.value = true;
    //     error.value = null;
    //     try {
    //         const { data } = await $apifetch(`/api/contact/admin`, {
    //             params: {
    //                 type: type.value,
    //                 page: page,
    //                 per_page: perPage,
    //                 ...options,
    //             },
    //             key: `contacts-${type.value}-${page}`,
    //         });
    //         contacts.value = Array.isArray(data) ? data : [];
    //         pagination.value = {
    //             current_page: data?.current_page,
    //             last_page: data?.last_page,
    //             total: data?.total,
    //         };
    //     }
    //     catch (e) {
    //         error.value = e;
    //     }
    //     finally {
    //         loading.value = false;
    //     }
    // };

    async function getContacts(type: Ref<string> = ref('nurstech'), page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/admin/contacts', {
            params: {
                type: type.value,
                page: page,
                perPage: perPage,
                ...options,
            },
            key: `contacts-${type.value}-${page}`,
        }).then((response) => {
            contacts.value = response.contacts;
            count.value = response.count;
        });
    }

    return {
        contacts,
        loading,
        error,
        pagination,
        getContacts,
    };
}
