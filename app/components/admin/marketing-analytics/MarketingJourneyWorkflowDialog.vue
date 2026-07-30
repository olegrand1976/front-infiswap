<template>
    <Dialog
        :open="open"
        @update:open="onOpenChange"
    >
        <DialogContent class="w-[calc(100vw-1.5rem)] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col gap-3 p-4 sm:p-6">
            <div
                data-testid="journey-workflow-dialog"
                class="contents"
            >
                <DialogHeader>
                    <DialogTitle>{{ title }}</DialogTitle>
                    <DialogDescription>
                        Template, destinataires et taux d’engagement sur la période sélectionnée.
                    </DialogDescription>
                </DialogHeader>

                <div
                    v-if="stats"
                    class="flex flex-wrap items-center gap-2 text-xs text-gray-600"
                >
                    <span class="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
                        {{ stats.sends }} envois
                    </span>
                    <span class="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-teal-800">
                        Open {{ stats.opens }} ({{ formatRate(stats.open_rate) }})
                    </span>
                    <span class="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-indigo-800">
                        Clic {{ stats.clicks }} ({{ formatRate(stats.click_rate) }})
                    </span>
                    <span
                        v-if="stats.trackable_sends < stats.sends"
                        class="text-amber-700"
                    >
                        Taux calculés sur {{ stats.trackable_sends }} envois trackés uniquement
                    </span>
                </div>

                <div
                    class="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 self-start"
                    role="tablist"
                    aria-label="Sections Journey"
                >
                    <button
                        type="button"
                        class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                        :class="tab === 'template' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-white'"
                        :aria-selected="tab === 'template'"
                        @click="tab = 'template'"
                    >
                        Template
                    </button>
                    <button
                        type="button"
                        class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                        :class="tab === 'recipients' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-white'"
                        :aria-selected="tab === 'recipients'"
                        @click="tab = 'recipients'"
                    >
                        Destinataires
                    </button>
                </div>

                <div class="min-h-0 flex-1 overflow-y-auto">
                    <div
                        v-if="loading"
                        class="h-64 rounded-md bg-gray-100 animate-pulse"
                    />

                    <template v-else-if="tab === 'template'">
                        <p
                            v-if="preview?.archived"
                            class="text-sm text-gray-600 rounded-md border border-dashed p-4"
                        >
                            Template archivé (upsell accès réseau) — plus de Blade actif.
                        </p>
                        <template v-else-if="(preview?.variants?.length ?? 0) > 0">
                            <div
                                v-if="(preview?.variants?.length ?? 0) > 1"
                                class="mb-3 flex flex-wrap gap-1.5"
                            >
                                <button
                                    v-for="variant in preview?.variants ?? []"
                                    :key="variant.key"
                                    type="button"
                                    class="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                                    :class="activeVariantKey === variant.key
                                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
                                    @click="activeVariantKey = variant.key"
                                >
                                    {{ variant.label }}
                                </button>
                            </div>
                            <p
                                v-if="activeVariant"
                                class="mb-2 text-xs text-gray-500"
                            >
                                Objet : <span class="font-medium text-gray-800">{{ activeVariant.subject }}</span>
                            </p>
                            <iframe
                                v-if="activeVariant"
                                :srcdoc="activeVariant.html"
                                title="Prévisualisation e-mail Journey"
                                class="w-full h-[50vh] rounded-md border border-gray-200 bg-white"
                                sandbox=""
                            />
                        </template>
                        <p
                            v-else
                            class="text-sm text-gray-500"
                        >
                            Aucun template disponible pour ce workflow.
                        </p>
                    </template>

                    <template v-else>
                        <div class="overflow-x-auto rounded-md border border-gray-200">
                            <table class="min-w-full text-sm">
                                <thead class="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th class="px-3 py-2 font-medium">
                                            Destinataire
                                        </th>
                                        <th class="px-3 py-2 font-medium">
                                            Step
                                        </th>
                                        <th class="px-3 py-2 font-medium">
                                            Envoyé
                                        </th>
                                        <th class="px-3 py-2 font-medium">
                                            Ouvert
                                        </th>
                                        <th class="px-3 py-2 font-medium">
                                            Clic
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="row in recipients"
                                        :key="row.id"
                                    >
                                        <td class="px-3 py-2">
                                            <p class="font-medium text-gray-900">
                                                {{ row.full_name }}
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                {{ row.email }}
                                            </p>
                                        </td>
                                        <td class="px-3 py-2 text-gray-600">
                                            {{ row.step ?? '—' }}
                                        </td>
                                        <td class="px-3 py-2 text-gray-600 whitespace-nowrap">
                                            {{ formatDateTime(row.sent_at) }}
                                        </td>
                                        <td class="px-3 py-2 text-gray-600 whitespace-nowrap">
                                            {{ row.trackable ? formatDateTime(row.opened_at) : 'n/a' }}
                                        </td>
                                        <td class="px-3 py-2 text-gray-600 whitespace-nowrap">
                                            {{ row.trackable ? formatDateTime(row.clicked_at) : 'n/a' }}
                                        </td>
                                    </tr>
                                    <tr v-if="recipients.length === 0">
                                        <td
                                            colspan="5"
                                            class="px-3 py-6 text-center text-gray-500"
                                        >
                                            Aucun destinataire sur cette période.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div
                            v-if="totalPages > 1"
                            class="mt-3 flex items-center justify-between text-sm"
                        >
                            <button
                                type="button"
                                class="text-teal-700 disabled:text-gray-300"
                                :disabled="page <= 1 || loading"
                                @click="loadPage(page - 1)"
                            >
                                Précédent
                            </button>
                            <span class="text-gray-500">{{ page }} / {{ totalPages }}</span>
                            <button
                                type="button"
                                class="text-teal-700 disabled:text-gray-300"
                                :disabled="page >= totalPages || loading"
                                @click="loadPage(page + 1)"
                            >
                                Suivant
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    type JourneySendRecipient,
    type JourneySendStats,
    type JourneyTemplatePreview,
    type MarketingAnalyticsPeriod,
    useMarketingAnalytics,
} from '@/composables/useMarketingAnalytics';
import { formatJourneyEngagementRate } from '@/utils/journeyMarketingAnalytics';

const props = defineProps<{
    open: boolean;
    workflow: string | null;
    title: string;
    period: MarketingAnalyticsPeriod;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const { getJourneyTemplatePreview, getJourneySends } = useMarketingAnalytics();

const tab = ref<'template' | 'recipients'>('template');
const loading = ref(false);
const preview = ref<JourneyTemplatePreview | null>(null);
const stats = ref<JourneySendStats | null>(null);
const recipients = ref<JourneySendRecipient[]>([]);
const page = ref(1);
const count = ref(0);
const activeVariantKey = ref<string | null>(null);
const perPage = 25;

const totalPages = computed(() => Math.max(1, Math.ceil(count.value / perPage)));

const activeVariant = computed(() => {
    const variants = preview.value?.variants ?? [];
    if (variants.length === 0) {
        return null;
    }
    return variants.find(v => v.key === activeVariantKey.value) ?? variants[0];
});

watch(
    () => [props.open, props.workflow, props.period] as const,
    async ([isOpen, workflow]) => {
        if (!isOpen || !workflow) {
            return;
        }
        tab.value = 'template';
        page.value = 1;
        await loadAll(workflow);
    },
);

async function loadAll(workflow: string) {
    loading.value = true;
    try {
        const [previewData, sendsData] = await Promise.all([
            getJourneyTemplatePreview(workflow),
            getJourneySends(workflow, props.period, 1, perPage),
        ]);
        preview.value = previewData;
        activeVariantKey.value = previewData.variants[0]?.key ?? null;
        stats.value = sendsData.stats;
        recipients.value = sendsData.users;
        count.value = sendsData.count;
        page.value = 1;
    }
    finally {
        loading.value = false;
    }
}

async function loadPage(nextPage: number) {
    if (!props.workflow) {
        return;
    }
    loading.value = true;
    try {
        const sendsData = await getJourneySends(props.workflow, props.period, nextPage, perPage);
        stats.value = sendsData.stats;
        recipients.value = sendsData.users;
        count.value = sendsData.count;
        page.value = nextPage;
    }
    finally {
        loading.value = false;
    }
}

function onOpenChange(value: boolean) {
    emit('update:open', value);
}

function formatRate(value: number | null): string {
    return formatJourneyEngagementRate(value);
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return '—';
    }
    try {
        return new Intl.DateTimeFormat('fr-BE', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date(value));
    }
    catch {
        return value;
    }
}
</script>
