import { useNuxtApp } from '#app';

export type ContactUnreadCounts = {
    infiswap: number;
    nurstech: number;
    nursassur: number;
    total: number;
};

const emptyUnreadCounts = (): ContactUnreadCounts => ({
    infiswap: 0,
    nurstech: 0,
    nursassur: 0,
    total: 0,
});

export const submitContact = async (formData) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact',
        { method: 'post', body: formData },
    );
};

export const submitInstitutionOfferStudy = async (body: {
    institutionName: string;
    email: string;
    repId?: string;
}) => {
    const { $apifetch } = useNuxtApp();

    await $apifetch('/api/contact/institution-offer', {
        method: 'post',
        body: {
            institution_name: body.institutionName,
            email: body.email,
            ...(body.repId ? { rep_id: body.repId } : {}),
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
    const unreadCounts = useState<ContactUnreadCounts>('contactUnreadCounts', emptyUnreadCounts);

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
            count.value = response.meta?.total ?? response.count;
        });
    }

    async function fetchUnreadCounts() {
        const response = await $apifetch('api/admin/contacts/unread-counts');
        unreadCounts.value = {
            ...emptyUnreadCounts(),
            ...(response?.data ?? {}),
        };

        return unreadCounts.value;
    }

    async function markAsRead(type: string, id: number) {
        await $apifetch(`api/admin/contacts/${type}/${id}/read`, {
            method: 'PATCH',
        });
        await fetchUnreadCounts();
    }

    async function deleteContact(type: string, id: number) {
        await $apifetch(`api/admin/contacts/${type}/${id}`, {
            method: 'DELETE',
        });
        await fetchUnreadCounts();
    }

    return {
        contacts,
        loading,
        error,
        count,
        pagination,
        unreadCounts,
        getContacts,
        fetchUnreadCounts,
        markAsRead,
        deleteContact,
    };
}
