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
    const count = useState<number>('contactCount', () => 0);

    async function getContacts(type: Ref<string> = ref('nurstech'), page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/admin/contacts', {
            params: {
                type: type.value,
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            contacts.value = response.contacts;
            count.value = response.count;
        });
    }

    return {
        contacts,
        loading,
        error,
        count,
        pagination,
        getContacts,
    };
}
