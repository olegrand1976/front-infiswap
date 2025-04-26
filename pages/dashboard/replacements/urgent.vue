<template>
    <div class="space-y-6">
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Liste des remplacements immédiates
                <strong>
                    du moment
                </strong>
            </h1>
        </div>

        <div class="overflow-x-auto p-4">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Heures concernées
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Code Postal
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
                            {{ replacement.start_time }} - {{ replacement.end_time }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ formatDate(replacement.start_date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {{ replacement.nurse_zip_code || 'N/A' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <button
                                class="bg-success hover:bg-success/90 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow"
                                @click="handleInterest(replacement.id, user.nurse.id)"
                            >
                                Je suis intéressé
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNearbyReplacements } from '~/composables/useReplacements';

const user = useUser();
const { $apifetch, $toast } = useNuxtApp();
const { replacements, fetchNearbyreplacements } = useNearbyReplacements();

await fetchNearbyreplacements();

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const handleInterest = async (replacementId, nurseId) => {
    try {
        await $apifetch(`/api/replacements/interest/${replacementId}/${nurseId}`, {
            method: 'GET',
        });
        $toast({
            title: 'Succès',
            description: 'Intérêt marqué avec succès !',
        });
    }
    catch (error) {
        let errorMessage = 'Une erreur est survenue.';

        if (error?.response?._data?.message) {
            errorMessage = error.response._data.message;
        }

        $toast({
            title: 'Oups !',
            description: errorMessage,
            variant: 'destructive',
        });
    }
};

useHead({
    title: 'Liste des remplacements rapides',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth-help', 'subscribed'],
    ssr: false,
});
</script>
