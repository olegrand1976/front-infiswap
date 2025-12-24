<template>
    <div class="p-4">
        <div class="w-full overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-gray-100 text-left">
                        <th class="px-4 py-2 border-b">
                            Nom
                        </th>
                        <th class="px-4 py-2 border-b">
                            Email
                        </th>
                        <th class="px-4 py-2 border-b">
                            Téléphone
                        </th>
                        <th class="px-4 py-2 border-b">
                            Statut
                        </th>
                        <th class="px-4 py-2 border-b">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in interestedUsers"
                        :key="index"
                        class="hover:bg-gray-50"
                    >
                        <td class="px-4 py-2 border-b">
                            <UsersCrm
                                :user="item.user"
                                class="font-medium text-gray-800"
                            />
                        </td>
                        <td class="px-4 py-2 border-b">
                            {{ item.user.email }}
                        </td>
                        <td class="px-4 py-2 border-b">
                            {{ item.user.phone_number }}
                        </td>
                        <td
                            :class="cn('px-4 py-2 border-b font-semibold', {
                                'text-yellow-500': item.status === 'pending',
                                'text-green-600': item.status === 'accepted',
                                'text-red-600': item.status === 'canceled',
                            })"
                        >
                            {{ translateStatus(item.status) }}
                        </td>
                        <td class="px-4 py-2 border-b">
                            <button
                                class="text-blue-600 hover:underline"
                                @click="openModal(item.user)"
                            >
                                Voir détail
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            v-if="showModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[600px] max-w-full relative max-h-[90vh] overflow-auto"
            >
                <button
                    class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                    @click="closeModal"
                >
                    &times;
                </button>
                <UsersCard :user="selectedUser" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responses: any;
}>();

const translateStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return 'En cours';
        case 'accepted':
            return 'Accepté';
        case 'canceled':
            return 'Annulé';
        case 'refused':
            return 'Refusé';
        default:
            return status;
    }
};

const interestedUsers = computed(() => {
    if (!props.responses?.length) return [];

    return props.responses.map(response => ({
        status: response.status,
        user: response.interested_user,
    }));
});

const showModal = ref(false);
const selectedUser = ref(null);

function openModal(user) {
    selectedUser.value = user;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    selectedUser.value = null;
}
</script>
