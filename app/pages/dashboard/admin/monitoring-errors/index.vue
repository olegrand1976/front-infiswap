<template>
    <div class="max-w-6xl mx-auto space-y-6">
        <div class="bg-white rounded-lg border p-6 flex items-center justify-between">
            <div>
                <h1 class="text-xl font-semibold">
                    Monitoring erreurs Laravel
                </h1>
                <p class="text-sm text-gray-600">
                    Liste des erreurs critiques enregistrees dans le backend (cache/redis).
                </p>
            </div>
            <button
                type="button"
                class="px-4 py-2 rounded border text-sm hover:bg-gray-50"
                @click="refresh"
            >
                Rafraichir
            </button>
        </div>

        <div class="bg-white rounded-lg border overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3">Date</th>
                        <th class="text-left px-4 py-3">Message</th>
                        <th class="text-left px-4 py-3">Classe</th>
                        <th class="text-left px-4 py-3">Route</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in errors"
                        :key="item.id"
                        class="border-b last:border-b-0"
                    >
                        <td class="px-4 py-3 whitespace-nowrap">
                            {{ formatDate(item.created_at) }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="font-medium">{{ item.message }}</div>
                            <div class="text-xs text-gray-500">{{ item.file }}:{{ item.line }}</div>
                        </td>
                        <td class="px-4 py-3">{{ item.exception_class }}</td>
                        <td class="px-4 py-3">{{ item.method || 'CLI' }} - {{ item.url || '-' }}</td>
                    </tr>
                    <tr v-if="errors.length === 0">
                        <td
                            colspan="4"
                            class="px-4 py-8 text-center text-gray-500"
                        >
                            Aucune erreur enregistree.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'Monitoring erreurs Laravel' });

const { isSuperAdmin, isDeveloper } = useAuth();
const { errors, getMonitoringErrors } = useMonitoring();

if (!isSuperAdmin.value && !isDeveloper.value) {
    await navigateTo('/dashboard/admin', { replace: true });
}

const refresh = async () => {
    await getMonitoringErrors(1, 50);
};

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('fr-FR');
};

await refresh();
</script>
