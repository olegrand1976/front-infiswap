<template>
    <div class="rounded-lg border border-amber-200 bg-amber-50/80 p-4 mb-4">
        <div class="flex items-center justify-between gap-3 mb-3">
            <h3 class="text-sm font-semibold text-amber-900">
                Risque de churn institution
            </h3>
            <Button
                variant="outline"
                size="sm"
                :disabled="loading"
                :in-progress="loading"
                @click="load"
            >
                Actualiser
            </Button>
        </div>

        <RollingLoader
            v-if="loading && !items.length"
            :loading="loading"
        />

        <p
            v-else-if="!items.length"
            class="text-sm text-amber-800/80"
        >
            Aucun contrat à risque identifié pour le moment.
        </p>

        <ul
            v-else
            class="space-y-2"
        >
            <li
                v-for="item in items"
                :key="item.contract_id"
                class="rounded-md border border-amber-100 bg-white p-3 text-sm"
            >
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="font-medium">{{ item.institution_name }}</span>
                    <span
                        class="px-2 py-0.5 rounded-full text-xs font-semibold"
                        :class="riskBadgeClass(item.risk_level)"
                    >
                        {{ riskLabel(item.risk_level) }}
                    </span>
                </div>
                <p class="text-xs text-muted-foreground mt-1">
                    BC {{ item.reference }}
                </p>
                <ul class="mt-2 text-xs text-amber-900/90 list-disc pl-4 space-y-0.5">
                    <li
                        v-for="(reason, index) in item.reasons"
                        :key="index"
                    >
                        {{ reason }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import RollingLoader from '~/components/RollingLoader.vue';

type ChurnRiskItem = {
    contract_id: number;
    reference?: string | null;
    institution_name?: string | null;
    risk_level: 'low' | 'medium' | 'high';
    reasons: string[];
};

const { $apifetch } = useNuxtApp();

const items = ref<ChurnRiskItem[]>([]);
const loading = ref(false);

function riskBadgeClass(level: string): string {
    if (level === 'high') return 'bg-red-100 text-red-800';
    if (level === 'medium') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-700';
}

function riskLabel(level: string): string {
    if (level === 'high') return 'Risque élevé';
    if (level === 'medium') return 'Risque moyen';
    return 'Faible';
}

async function load() {
    loading.value = true;
    try {
        const response = await $apifetch<{ data: ChurnRiskItem[] }>('api/crm/institution-subscriptions/churn-risk');
        items.value = response.data ?? [];
    }
    catch {
        items.value = [];
    }
    finally {
        loading.value = false;
    }
}

onMounted(load);
</script>
