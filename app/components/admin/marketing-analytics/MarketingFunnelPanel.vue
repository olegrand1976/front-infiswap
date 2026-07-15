<template>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 pb-4">
        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-5">
            <h3 class="font-semibold text-sm text-gray-800 mb-4">
                Funnel conversion (inscriptions période)
            </h3>
            <div
                v-if="loading"
                class="h-40 animate-pulse bg-gray-100 rounded-md"
            />
            <dl
                v-else
                class="grid grid-cols-2 gap-3"
            >
                <div
                    v-for="item in funnelItems"
                    :key="item.label"
                    class="rounded-md border border-gray-100 p-3"
                >
                    <dt class="text-xs uppercase tracking-wide text-gray-500">
                        {{ item.label }}
                    </dt>
                    <dd class="text-2xl font-bold text-gray-900 mt-1">
                        {{ item.value }}
                    </dd>
                </div>
            </dl>
        </section>

        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-5">
            <h3 class="font-semibold text-sm text-gray-800 mb-4">
                Emails Journey
            </h3>
            <div
                v-if="loading"
                class="h-40 animate-pulse bg-gray-100 rounded-md"
            />
            <template v-else>
                <p class="text-sm text-gray-600 mb-3">
                    {{ journey?.total_sends ?? 0 }} envois sur la période
                </p>
                <ul class="space-y-2 max-h-48 overflow-y-auto">
                    <li
                        v-for="workflow in journey?.by_workflow ?? []"
                        :key="workflow.workflow"
                        class="flex items-center justify-between text-sm border-b border-gray-50 pb-2"
                    >
                        <span class="font-medium text-gray-700">{{ workflow.workflow }}</span>
                        <span class="text-gray-900">{{ workflow.sends }}</span>
                    </li>
                    <li
                        v-if="(journey?.by_workflow ?? []).length === 0"
                        class="text-sm text-gray-500"
                    >
                        Aucun envoi Journey sur la période.
                    </li>
                </ul>
            </template>
        </section>

        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-5 xl:col-span-2">
            <h3 class="font-semibold text-sm text-gray-800 mb-4">
                Partenaires (30 jours)
            </h3>
            <div
                v-if="loading"
                class="h-24 animate-pulse bg-gray-100 rounded-md"
            />
            <div
                v-else
                class="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                <div class="rounded-md border border-gray-100 p-3">
                    <p class="text-xs text-gray-500">Clics NursTech</p>
                    <p class="text-xl font-bold">{{ partners?.clicks.nurstech_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 p-3">
                    <p class="text-xs text-gray-500">Clics NursAssur</p>
                    <p class="text-xl font-bold">{{ partners?.clicks.nursassur_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 p-3">
                    <p class="text-xs text-gray-500">Contacts NursTech</p>
                    <p class="text-xl font-bold">{{ partners?.contacts.nurstech_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 p-3">
                    <p class="text-xs text-gray-500">Contacts NursAssur</p>
                    <p class="text-xl font-bold">{{ partners?.contacts.nursassur_30d ?? 0 }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { MarketingAnalyticsOverview } from '@/composables/useMarketingAnalytics';

const props = defineProps<{
    conversion: MarketingAnalyticsOverview['conversion'] | null;
    journey: MarketingAnalyticsOverview['journey_emails'] | null;
    partners: MarketingAnalyticsOverview['partners'] | null;
    loading?: boolean;
}>();

const funnelItems = computed(() => [
    { label: 'Inscriptions', value: props.conversion?.registrations ?? 0 },
    { label: 'Email vérifié', value: props.conversion?.email_verified ?? 0 },
    { label: 'Accès réseau', value: props.conversion?.platform_access ?? 0 },
    { label: 'Boost', value: props.conversion?.boost_purchases ?? 0 },
    { label: 'Contrat', value: props.conversion?.contract_purchases ?? 0 },
]);
</script>
