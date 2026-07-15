<template>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-3 px-4 pb-4">
        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-4 xl:col-span-1">
            <h3 class="font-semibold text-sm text-gray-800 mb-3">
                Funnel conversion
            </h3>
            <div
                v-if="loading"
                class="h-32 animate-pulse bg-gray-100 rounded-md"
            />
            <template v-else>
                <dl class="grid grid-cols-2 gap-2">
                    <div
                        v-for="item in funnelItems"
                        :key="item.label"
                        class="rounded-md border border-gray-100 px-2.5 py-2"
                    >
                        <dt class="text-[11px] uppercase tracking-wide text-gray-500">
                            {{ item.label }}
                        </dt>
                        <dd class="text-xl font-bold text-gray-900 mt-0.5">
                            {{ item.value }}
                        </dd>
                    </div>
                </dl>
                <div
                    v-if="acquisition"
                    class="mt-3 flex flex-wrap gap-2 text-xs text-gray-600"
                >
                    <span class="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1">
                        BE {{ acquisition.belgium }}
                    </span>
                    <span class="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1">
                        FR {{ acquisition.france }}
                    </span>
                </div>
            </template>
        </section>

        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-4 xl:col-span-1">
            <h3 class="font-semibold text-sm text-gray-800 mb-3">
                Emails Journey
            </h3>
            <div
                v-if="loading"
                class="h-32 animate-pulse bg-gray-100 rounded-md"
            />
            <template v-else>
                <p class="text-xs text-gray-500 mb-2">
                    <span class="text-lg font-bold text-gray-900">{{ journey?.total_sends ?? 0 }}</span>
                    envois
                </p>
                <ul class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    <li
                        v-for="workflow in journey?.by_workflow ?? []"
                        :key="workflow.workflow"
                    >
                        <span class="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                            <span class="font-medium">{{ workflow.workflow }}</span>
                            <span class="font-semibold text-gray-900">{{ workflow.sends }}</span>
                        </span>
                    </li>
                    <li
                        v-if="(journey?.by_workflow ?? []).length === 0"
                        class="text-sm text-gray-500"
                    >
                        Aucun envoi sur la période.
                    </li>
                </ul>
            </template>
        </section>

        <section class="bg-white rounded-md shadow-sm border border-gray-100 p-4 xl:col-span-1">
            <h3 class="font-semibold text-sm text-gray-800 mb-3">
                Partenaires (30 j)
            </h3>
            <div
                v-if="loading"
                class="h-32 animate-pulse bg-gray-100 rounded-md"
            />
            <div
                v-else
                class="grid grid-cols-2 gap-2"
            >
                <div class="rounded-md border border-gray-100 px-2.5 py-2">
                    <p class="text-[11px] text-gray-500">Clics NursTech</p>
                    <p class="text-lg font-bold text-gray-900">{{ partners?.clicks.nurstech_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 px-2.5 py-2">
                    <p class="text-[11px] text-gray-500">Clics NursAssur</p>
                    <p class="text-lg font-bold text-gray-900">{{ partners?.clicks.nursassur_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 px-2.5 py-2">
                    <p class="text-[11px] text-gray-500">Contacts NursTech</p>
                    <p class="text-lg font-bold text-gray-900">{{ partners?.contacts.nurstech_30d ?? 0 }}</p>
                </div>
                <div class="rounded-md border border-gray-100 px-2.5 py-2">
                    <p class="text-[11px] text-gray-500">Contacts NursAssur</p>
                    <p class="text-lg font-bold text-gray-900">{{ partners?.contacts.nursassur_30d ?? 0 }}</p>
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
    acquisition?: MarketingAnalyticsOverview['acquisition'] | null;
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
