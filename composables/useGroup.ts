import { ref } from 'vue';
import { useNuxtApp } from '#app';

export function useGroup() {
    const { $apifetch } = useNuxtApp();
    const groups = ref([]);
    const selectedGroup = ref(null);
    const selectedGroupUsers = ref([]);
    // const pagination = ref({
    //     current_page: 1,
    //     per_page: 15,
    //     total: 0,
    //     last_page: 1,
    // });
    const count = ref(0);

    async function myGroups() {
        const data = await $apifetch('/api/groups/me');
        groups.value = data.groups ?? [];

        if (groups.value.length > 0) {
            await getGroupDetails(groups.value[0].id);
        }
    }

    async function getGroupDetails(groupId: number, page = 1, perPage = 15, filters = {}) {
        const data = await $apifetch(`/api/groups/${groupId}`, {
            params: {
                page,
                perPage,
                ...filters,
            },
        });
        selectedGroup.value = data.group ?? null;
        selectedGroupUsers.value = data.users.data ?? [];
        count.value = data.count ?? 0;
        // pagination.value = data.pagination ?? pagination.value;
    }

    const fetchGroupMembers = async (groupIds: number[]) => {
        if (groupIds.length === 0) return [];

        try {
            const response = await $apifetch('/api/groups/members', {
                method: 'POST',
                body: { groupIds },
            });

            return response.users || [];
        }
        catch (error) {
            console.error('Erreur fetchGroupMembers:', error);
            return [];
        }
    };

    const newGroup = async (formData) => {
        return await $apifetch(`/api/groups`, {
            method: 'POST',
            body: formData,
        });
    };

    const assignUser = async (groupId: number, formData) => {
        return await $apifetch(`/api/groups/assign/${groupId}`, {
            method: 'POST',
            body: formData,
        });
    };

    return {
        groups,
        selectedGroup,
        selectedGroupUsers,
        // pagination,
        myGroups,
        getGroupDetails,
        fetchGroupMembers,
        newGroup,
        assignUser,
        count,
    };
}
