<template>
    <div>
        <h1 class="py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            Les remplacements <strong>auxquels j'ai répondu</strong>
        </h1>
        <template v-if="listApply == 0">
            <p class="text-black/50 mt-16 text-center">
                Aucune donnée à afficher pour le moment
            </p>
        </template>
        <template v-else>
            <div class="grid gap-6 mt-8">
                <div
                    v-for="(item, index) in listApply"
                    :key="index"
                    class="bg-gray-100 shadow rounded-lg px-6 py-6 hover:shadow-md transition"
                >
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <div>
                            <p class="text-gray-800 text-lg font-medium leading-snug">
                                Remplacement du
                                <span class="text-primary">{{ formatDate(item.replacement.start_date) }}</span>
                                au
                                <span class="text-primary">{{ formatDate(item.replacement.end_date) }}</span>
                            </p>
                            <p
                                v-if="item.replacement.type === 'immediate'"
                                class="text-sm sm:text-base bg-primary text-white font-bold mt-3 px-3 py-1 rounded inline-block leading-snug"
                            >
                                <span class="capitalize">URGENT</span>
                            </p>
                        </div>

                        <span
                            class="self-start sm:self-center px-3 py-1 rounded-full text-sm sm:text-base font-medium text-center w-fit"
                            :class="{
                                'bg-yellow-100 text-yellow-700': item.response.status === 'pending',
                                'bg-green-100 text-green-700': item.response.status === 'confirmed',
                                'bg-blue-100 text-blue-700': item.response.status === 'chat_enabled',
                                'bg-red-100 text-red-700': item.response.status === 'cancelled',
                            }"
                        >
                            {{ formatStatus(item.response.status) }}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-800 text-sm sm:text-base mb-4">
                        <p><span class="font-medium">Nombre de patients :</span> {{ item.replacement.patient_count }}</p>
                        <p><span class="font-medium">Codes postaux :</span> {{ formatArray(item.replacement.zip_codes) }}</p>
                        <p><span class="font-medium">Villes :</span> {{ formatArray(item.replacement.cities) }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm sm:text-base gap-2">
                        <p
                            v-if="item.response.created_at"
                            class="text-gray-500"
                        >
                            Candidature envoyée le {{ formatDate(item.response.created_at) }}
                        </p>
                        <div
                            v-else
                            class="h-5"
                        />
                        <NuxtLink
                            :to="`/dashboard/replacements/detail/${item.replacement.id}`"
                            class="text-primary hover:underline font-medium"
                        >
                            ➤ Voir le détail
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useListResponse } from '~/composables/useReplacements';

const user = useState('user');
const { listApply, getReplacementApply } = useListResponse(user.value.nurse.id);

await getReplacementApply();

useHead({
    title: 'Mes accords',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatArray = (jsonString: string): string => {
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed.join(', ') : jsonString;
    }
    catch {
        return jsonString;
    }
};

const formatStatus = (status: string): string => {
    const statuses: Record<string, string> = {
        pending: 'En attente',
        confirmed: 'Confirmé',
        chat_enabled: 'Chat activé',
        cancelled: 'Annulé',
    };
    return statuses[status] || status;
};
</script>
