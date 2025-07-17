import { useNuxtApp } from '#app';

export const submitContact = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact',
        { method: 'post', body: formData },
    );
};

export function useContact(type = 'nurstech', perPage = 10) {
    const contacts = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const pagination = ref({});
    const { $apifetch } = useNuxtApp();

    const fetchContacts = async (page = 1) => {
        console.log('aiza ho aiza ato');
        loading.value = true;
        error.value = null;
        try {
            console.log('alorssss');
            const { data } = await $apifetch(`/api/contact/admin`, {
                params: { type: type.value, page, per_page: perPage }, // ✅ ici
                key: `contacts-${type.value}-${page}`, // ✅ ici aussi
            });
            console.log('fa aona ary zany ', data);
            console.log('fa aona ny azo ', Array.isArray(data.value?.data) ? data.value?.data : []);
            contacts.value = Array.isArray(data.value?.data) ? data.value?.data : [];
            pagination.value = {
                current_page: data.value?.current_page,
                last_page: data.value?.last_page,
                total: data.value?.total,
            };
        }
        catch (e) {
            console.log('aiza ilay erreur ', e);
            error.value = e;
        }
        finally {
            loading.value = false;
        }
    };

    watchEffect(() => {
        fetchContacts();
    });

    return {
        contacts,
        loading,
        error,
        pagination,
        fetchContacts,
    };
}
