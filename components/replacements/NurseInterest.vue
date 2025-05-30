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
                            Status
                        </th>
                        <th class="px-4 py-2 border-b">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in responses"
                        :key="index"
                        class="hover:bg-gray-50"
                    >
                        <td class="px-4 py-2 border-b">
                            {{ item.repondedBy.full_name }}
                        </td>
                        <td class="px-4 py-2 border-b">
                            {{ item.repondedBy.email }}
                        </td>
                        <td class="px-4 py-2 border-b">
                            {{ item.repondedBy.phone_number }}
                        </td>
                        <td
                            :class="cn('px-4 py-2 border-b font-semibold', {
                                'text-yellow-500': item.status === 'pending',
                                'text-green-600': item.status === 'confirmed',
                                'text-red-600': item.status === 'canceled',
                            })"
                        >
                            {{ traduireStatut(item.status) }}
                        </td>
                        <td class="px-4 py-2 border-b">
                            <button
                                class="text-blue-600 hover:underline"
                                @click="openModal(item.repondedBy)"
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
                class="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-[95%] sm:w-auto max-w-sm relative"
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
import type { ReplacementResponse } from '~/lib/types';

defineProps<{
    responses: ReplacementResponse[];
}>();

const traduireStatut = (statut: string) => {
    switch (statut) {
        case 'pending':
            return 'En cours';
        case 'confirmed':
            return 'Accepté';
        case 'canceled':
            return 'Annulé';
        case 'refused':
            return 'Refusé';
        default:
            return statut;
    }
};

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
