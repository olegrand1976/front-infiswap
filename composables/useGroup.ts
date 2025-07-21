import { ref } from 'vue';
import { useNuxtApp } from '#app';

export function useGroup() {
    const { $apifetch } = useNuxtApp();
    const groups = ref([]);
    const selectedGroup = ref(null);
    const selectedGroupUsers = ref([]);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
    });

    async function myGroups() {
        const data = await $apifetch('/api/groups/me');
        groups.value = data.groups ?? [];

        if (groups.value.length > 0) {
            await fetchGroupDetails(groups.value[0].id);
        }
    }

    async function fetchGroupDetails(groupId: number, page = 1, perPage = 15, filters = {}) {
        const data = await $apifetch(`/api/groups/${groupId}`, {
            params: {
                page,
                perPage,
                ...filters,
            },
        });
        selectedGroup.value = data.group ?? null;
        selectedGroupUsers.value = data.users ?? [];
        pagination.value = data.pagination ?? pagination.value;
    }

    return {
        groups,
        selectedGroup,
        selectedGroupUsers,
        pagination,
        myGroups,
        fetchGroupDetails,
    };
}
