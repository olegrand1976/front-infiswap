<template>
    <div class="lg:ml-20 xl:ml-0 space-y-6">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <ArrowLeftIcon
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                Liste des remplacements urgentes <strong>pour aujourd'hui</strong>
            </h1>
        </div>

        <div class="overflow-x-auto p-4">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Heures concernées
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Codes postaux
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Villes
                        </th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="replacement in replacements"
                        :key="replacement.id"
                        class="border-t border-gray-200 hover:bg-gray-50"
                    >
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ formatDate(replacement.start_date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ replacement.start_time }} à {{ replacement.end_time }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ replacement.zip_codes }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ replacement.cities }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <template v-if="replacement.is_grayed">
                                <span class="text-sm text-gray-400 italic">
                                    Demande en cours
                                </span>
                            </template>
                            <template v-else-if="interestedReplacements.includes(replacement.id)">
                                <span class="text-sm text-gray-500">
                                    Intérêt confirmé
                                </span>
                            </template>
                            <template v-else>
                                <button
                                    class="bg-success hover:bg-success/90 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow"
                                    @click="handleInterest(replacement.id, user.id)"
                                >
                                    Je suis intéressé
                                </button>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-center mt-4">
                <CustomPagination
                    :default-page="pagination.current_page"
                    :total="pagination.total"
                    @update:page="currentPage = $event"
                    @update:per-page="perPage = $event"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { useNearbyReplacements } from '~/composables/useReplacements';
import { getErrorMessage, goBack } from '~/lib/utils';

const user = useUser();
const { $apifetch } = useNuxtApp();
const { replacements, fetchNearbyreplacements, pagination } = useNearbyReplacements();

const interestedReplacements = ref<number[]>([]);

const currentPage = ref(pagination.value.current_page);
const perPage = ref(pagination.value.per_page);

watch([currentPage, perPage], async ([newPage, newPerPage]) => {
    await fetchNearbyreplacements(newPage, newPerPage);
});

await fetchNearbyreplacements(currentPage.value, perPage.value);

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const handleInterest = async (replacementId, nurseId) => {
    try {
        await $apifetch('/api/replacement-responses/send', {
            method: 'POST',
            body: {
                replacementId: replacementId,
                respondedBy: nurseId,
                comment: null,
            },
        });
        interestedReplacements.value.push(replacementId);
        toast.success('Intérêt marqué avec succès !');
    }
    catch (error) {
        toast.error(getErrorMessage(error));
    }
};

useHead({
    title: 'Liste des remplacements rapides',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth-help'],
    ssr: false,
});
</script>
