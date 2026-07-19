<template>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-3 min-w-0">
        <section class="min-w-0 rounded-md border border-gray-100 bg-white p-4 shadow-sm">
            <div class="mb-1 flex items-center gap-1.5">
                <h3 class="font-semibold text-sm text-gray-800">
                    Funnel conversion
                </h3>
                <SettingsFieldHint
                    label="Funnel conversion"
                    text="Cohorte des comptes créés sur la période sélectionnée, puis progression vers vérification e-mail et achats (accès réseau, boost, contrat). Les pastilles BE/FR comptent les inscriptions avec pays profil Belgique / France."
                />
            </div>
            <p class="mb-3 text-xs text-gray-500">
                Inscriptions → activation → monétisation ({{ periodDays }} j)
            </p>
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
                        <dt class="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-500">
                            <span>{{ item.label }}</span>
                            <SettingsFieldHint
                                :label="item.label"
                                :text="item.hint"
                            />
                        </dt>
                        <dd class="text-xl font-bold text-gray-900 mt-0.5">
                            {{ item.value }}
                        </dd>
                    </div>
                </dl>
                <div
                    v-if="acquisition"
                    class="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600"
                >
                    <span class="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1">
                        BE {{ acquisition.belgium }}
                    </span>
                    <span class="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1">
                        FR {{ acquisition.france }}
                    </span>
                    <SettingsFieldHint
                        label="Répartition pays"
                        text="Nombre d’inscriptions de la période dont le profil indique la Belgique (BE) ou la France (FR). La somme peut être inférieure aux inscriptions totales si le pays n’est pas renseigné."
                    />
                </div>
            </template>
        </section>

        <section class="min-w-0 rounded-md border border-gray-100 bg-white p-4 shadow-sm">
            <div class="mb-1 flex items-center gap-1.5">
                <h3 class="font-semibold text-sm text-gray-800">
                    Emails Journey
                </h3>
                <SettingsFieldHint
                    label="Emails Journey"
                    text="Nombre d’e-mails marketing Journey réellement envoyés et enregistrés (table user_journey_sends) sur la période : onboarding, upsell accès réseau, digest, inactive, partenaires, etc. Un envoi = 1 ligne après succès d’envoi (scheduler daily 14h Europe/Brussels)."
                />
            </div>
            <p class="mb-3 text-xs text-gray-500">
                Envois automatisés sur {{ periodDays }} j
            </p>
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
                            <span class="font-medium">{{ workflowLabel(workflow.workflow) }}</span>
                            <span class="font-semibold text-gray-900">{{ workflow.sends }}</span>
                        </span>
                    </li>
                    <li
                        v-if="(journey?.by_workflow ?? []).length === 0"
                        class="text-sm text-gray-500 space-y-1"
                    >
                        <p>Aucun envoi Journey sur cette période.</p>
                        <p
                            v-if="journey?.last_sent_at"
                            class="text-xs"
                        >
                            Dernier envoi connu : {{ formatDateTime(journey.last_sent_at) }}.
                        </p>
                        <p
                            v-else
                            class="text-xs"
                        >
                            Aucun envoi jamais enregistré — vérifier le scheduler
                            <code class="text-[11px]">journey:run-daily</code>.
                        </p>
                    </li>
                </ul>
            </template>
        </section>

        <section class="min-w-0 rounded-md border border-gray-100 bg-white p-4 shadow-sm">
            <div class="mb-1 flex items-center gap-1.5">
                <h3 class="font-semibold text-sm text-gray-800">
                    Partenaires ({{ periodDays }} j)
                </h3>
                <SettingsFieldHint
                    label="Partenaires"
                    text="Clics et contacts CRM sur les produits NursTech / NursAssur pendant la fenêtre sélectionnée (même période que le sélecteur en haut). Un volume faible (ex. 1 clic NursTech) est normal si peu d’utilisatrices cliquent les bannières ou e-mails partenaires."
                />
            </div>
            <p class="mb-3 text-xs text-gray-500">
                Clics bannières / landing et contacts CRM
            </p>
            <div
                v-if="loading"
                class="h-32 animate-pulse bg-gray-100 rounded-md"
            />
            <div
                v-else
                class="grid grid-cols-2 gap-2"
            >
                <div
                    v-for="item in partnerItems"
                    :key="item.label"
                    class="rounded-md border border-gray-100 px-2.5 py-2"
                >
                    <p class="flex items-center gap-1 text-[11px] text-gray-500">
                        <span>{{ item.label }}</span>
                        <SettingsFieldHint
                            :label="item.label"
                            :text="item.hint"
                        />
                    </p>
                    <p class="text-lg font-bold text-gray-900">
                        {{ item.value }}
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import SettingsFieldHint from '@/components/settings/SettingsFieldHint.vue';
import type { MarketingAnalyticsOverview } from '@/composables/useMarketingAnalytics';

const props = withDefaults(defineProps<{
    conversion: MarketingAnalyticsOverview['conversion'] | null;
    journey: MarketingAnalyticsOverview['journey_emails'] | null;
    partners: MarketingAnalyticsOverview['partners'] | null;
    acquisition?: MarketingAnalyticsOverview['acquisition'] | null;
    periodDays?: number;
    loading?: boolean;
}>(), {
    periodDays: 30,
});

const funnelItems = computed(() => [
    {
        label: 'Inscriptions',
        value: props.conversion?.registrations ?? 0,
        hint: 'Comptes créés sur la période (tous rôles hors filtre staff du funnel).',
    },
    {
        label: 'Email vérifié',
        value: props.conversion?.email_verified ?? 0,
        hint: 'Parmi ces inscriptions, celles qui ont confirmé leur e-mail.',
    },
    {
        label: 'Accès réseau',
        value: props.conversion?.platform_access ?? 0,
        hint: 'Inscriptions de la période ayant payé l’accès réseau (9,90 € à vie).',
    },
    {
        label: 'Boost',
        value: props.conversion?.boost_purchases ?? 0,
        hint: 'Inscriptions de la période ayant acheté au moins un boost remplacement.',
    },
    {
        label: 'Contrat',
        value: props.conversion?.contract_purchases ?? 0,
        hint: 'Inscriptions de la période ayant acheté au moins un contrat de remplacement.',
    },
]);

const partnerItems = computed(() => [
    {
        label: 'Clics NursTech',
        value: props.partners?.clicks?.nurstech ?? props.partners?.clicks?.nurstech_30d ?? 0,
        hint: 'Clics trackés sur le produit NursTech (bannières, landings, liens).',
    },
    {
        label: 'Clics NursAssur',
        value: props.partners?.clicks?.nursassur ?? props.partners?.clicks?.nursassur_30d ?? 0,
        hint: 'Clics trackés sur le produit NursAssur (éligible surtout profils BE).',
    },
    {
        label: 'Contacts NursTech',
        value: props.partners?.contacts?.nurstech ?? props.partners?.contacts?.nurstech_30d ?? 0,
        hint: 'Contacts CRM ouverts / qualifiés NursTech sur la fenêtre.',
    },
    {
        label: 'Contacts NursAssur',
        value: props.partners?.contacts?.nursassur ?? props.partners?.contacts?.nursassur_30d ?? 0,
        hint: 'Contacts CRM ouverts / qualifiés NursAssur sur la fenêtre.',
    },
]);

const WORKFLOW_LABELS: Record<string, string> = {
    onboarding: 'Onboarding',
    platform_access_upsell: 'Upsell accès réseau',
    inactive_promo: 'Promo inactive',
    warm_inactive: 'Relance tiède',
    partner_services: 'Partenaires',
    partner_services_seasonal: 'Partenaires saisonniers',
    weekly_digest: 'Digest hebdo',
    poster_inactive: 'Afficheurs inactifs',
    institution_inactive: 'Institutions inactives',
    pending_response: 'Candidature en attente',
};

function workflowLabel(workflow: string): string {
    return WORKFLOW_LABELS[workflow] ?? workflow;
}

function formatDateTime(value: string): string {
    try {
        return new Intl.DateTimeFormat('fr-BE', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value));
    }
    catch {
        return value;
    }
}
</script>
