import { useNuxtApp } from '#app';

export const submitContact = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact',
        { method: 'post', body: formData },
    );
};

export const submitInstitutionOfferStudy = async (body: {
    institutionName: string;
    repId: string;
}) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact/institution-offer', {
        method: 'post',
        body: {
            institution_name: body.institutionName,
            rep_id: body.repId,
        },
    });
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
            console.log('response contacts', response);
            contacts.value = response.contacts;
            // count.value = response.count;
            count.value = response.meta?.total ?? response.count;
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
