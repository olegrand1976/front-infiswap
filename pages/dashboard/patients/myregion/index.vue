<template>
    <div class="mt-8 p-4">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Liste des patients de ma région
        </h1>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                <thead class="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th class="px-4 py-3">
                            Nom
                        </th>
                        <th class="px-4 py-3">
                            Code postal
                        </th>
                        <th class="px-4 py-3">
                            Ville
                        </th>
                        <th class="px-4 py-3">
                            Description
                        </th>
                        <th class="px-4 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody class="text-sm text-gray-800">
                    <tr
                        v-for="(patient, index) in patients"
                        :key="index"
                        class="border-t hover:bg-gray-50"
                    >
                        <td class="px-4 py-2">
                            {{ patient.firstname }} {{ patient.lastname }}
                        </td>
                        <td class="px-4 py-2">
                            {{ patient.zip_code }}
                        </td>
                        <td class="px-4 py-2">
                            {{ patient.city }}
                        </td>
                        <td class="px-4 py-2">
                            {{ patient.description }}
                        </td>
                        <td class="px-4 py-2">
                            <button
                                class="bg-primary text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                                @click="markAsInterested(patient.id)"
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
import { useNearbyPatients } from '~/composables/usePatients';

const { patients, error, fetchNearbyPatients } = useNearbyPatients();
const { $apifetch } = useNuxtApp();
const { $toast } = useNuxtApp();
const user = useUser();

function markAsInterested(guestPatientId) {
    $apifetch(`/api/nurses/${user.value.nurse.id}/${guestPatientId}/interest`, {
        method: 'POST',
    }).then(() => {
        $toast({
            title: 'Succès',
            description: 'Intérêt enregistré ✅',
        });
    }).catch((error) => {
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: 'Erreur lors de l’enregistrement de l’intérêt ❌', error,
            variant: 'destructive',
        });
    });
}

useHead({
    title: 'Liste des patients de mon régions',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});

onMounted(() => {
    fetchNearbyPatients();
});
</script>
