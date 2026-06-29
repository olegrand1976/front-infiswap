<template>
    <Dialog
        :open="open"
        @update:open="onOpenChange"
    >
        <DialogContent class="max-w-4xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto p-0">
            <div
                v-if="loading && !entityLabel"
                class="flex justify-center py-16"
            >
                <RollingLoader :loading="true" />
            </div>

            <template v-else>
                <DialogHeader class="border-b px-6 py-4">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                            <DialogTitle class="text-xl font-semibold text-primary">
                                {{ entityLabel }}
                            </DialogTitle>
                            <p class="mt-1 text-sm text-muted-foreground">
                                {{ profileSubtitle }}
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <NuxtLink
                                v-if="isInstitution && institutionAdminUrl"
                                :to="institutionAdminUrl"
                                class="text-sm text-primary underline"
                                @click="closeProfile"
                            >
                                Fiche admin complète
                            </NuxtLink>
                            <Button
                                variant="outline"
                                size="sm"
                                class="rounded-md"
                                @click="closeProfile"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div class="space-y-6 px-6 py-5">
                    <section class="grid gap-4 sm:grid-cols-2">
                        <div class="rounded-lg border bg-muted/20 p-4 space-y-2">
                            <h3 class="text-sm font-semibold text-primary">
                                Prospect
                            </h3>
                            <dl class="space-y-1 text-sm">
                                <div class="flex gap-2">
                                    <dt class="text-muted-foreground shrink-0">
                                        Apporteur
                                    </dt>
                                    <dd>{{ referrerLabel }}</dd>
                                </div>
                                <div
                                    v-if="isUser && activeUser?.created_at"
                                    class="flex gap-2"
                                >
                                    <dt class="text-muted-foreground shrink-0">
                                        Inscription
                                    </dt>
                                    <dd>{{ formatToDMY(activeUser.created_at) }}</dd>
                                </div>
                                <div
                                    v-if="isInstitution && activeInstitution?.registration_source"
                                    class="flex gap-2"
                                >
                                    <dt class="text-muted-foreground shrink-0">
                                        Source
                                    </dt>
                                    <dd>{{ registrationSourceLabel }}</dd>
                                </div>
                                <div
                                    v-if="isInstitution && activeInstitution?.subscription?.status_label"
                                    class="flex gap-2"
                                >
                                    <dt class="text-muted-foreground shrink-0">
                                        Bon de commande
                                    </dt>
                                    <dd>{{ activeInstitution.subscription.status_label }}</dd>
                                </div>
                                <div
                                    v-if="productSummaryLines.length"
                                    class="pt-1"
                                >
                                    <dt class="text-muted-foreground mb-1">
                                        Produits
                                    </dt>
                                    <dd class="space-y-0.5">
                                        <p
                                            v-for="line in productSummaryLines"
                                            :key="line"
                                            class="text-xs"
                                        >
                                            {{ line }}
                                        </p>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div class="rounded-lg border bg-muted/20 p-4 space-y-3">
                            <h3 class="text-sm font-semibold text-primary">
                                Suivi commercial
                            </h3>
                            <div
                                v-if="weeklyCounters"
                                class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3"
                            >
                                <div
                                    v-for="item in weeklyCounterItems"
                                    :key="item.label"
                                    class="rounded-md bg-background px-2 py-1.5"
                                >
                                    <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
                                        {{ item.label }}
                                    </p>
                                    <p class="text-lg font-bold tabular-nums">
                                        {{ item.value }}
                                    </p>
                                </div>
                            </div>
                            <p class="text-sm">
                                <span class="text-muted-foreground">Dernier contact :</span>
                                {{ lastContactLabel }}
                            </p>
                            <p
                                v-if="lastCommentText"
                                class="text-sm whitespace-pre-wrap"
                            >
                                <span class="text-muted-foreground">Commentaire :</span>
                                {{ lastCommentText }}
                            </p>
                            <div class="flex flex-wrap gap-2 pt-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    class="rounded-md"
                                    @click="emitProfileAction('contact')"
                                >
                                    Contact
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    class="rounded-md"
                                    @click="emitProfileAction('comment')"
                                >
                                    Commentaire
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    class="rounded-md"
                                    @click="emitProfileAction('referrer')"
                                >
                                    Apporteur
                                </Button>
                                <Button
                                    size="sm"
                                    class="rounded-md"
                                    :disabled="!commercialUserId"
                                    @click="commercialDialogOpen = true"
                                >
                                    Enregistrer une action
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section
                        v-if="isInstitution && activeInstitution"
                        class="rounded-lg border p-4 space-y-4"
                    >
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 class="text-sm font-semibold text-primary">
                                    Veille IA
                                </h3>
                                <p class="text-xs text-muted-foreground mt-0.5">
                                    Sources web automatiques — à vérifier avant usage commercial.
                                </p>
                                <p
                                    v-if="aiInsight?.generated_at"
                                    class="text-xs text-muted-foreground mt-1"
                                >
                                    Dernière mise à jour : {{ formatToDMY(aiInsight.generated_at) }}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                class="rounded-md"
                                :in-progress="aiRefreshing"
                                @click="refreshAiInsight"
                            >
                                Mettre à jour via IA
                            </Button>
                        </div>

                        <div
                            v-if="aiLoading"
                            class="flex justify-center py-8"
                        >
                            <RollingLoader :loading="true" />
                        </div>

                        <template v-else-if="aiInsight?.status === 'completed'">
                            <div
                                v-if="aiInsight.company_summary"
                                class="space-y-1"
                            >
                                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Informations société
                                </h4>
                                <p class="text-sm leading-relaxed whitespace-pre-wrap">
                                    {{ aiInsight.company_summary }}
                                </p>
                            </div>

                            <div
                                v-if="(aiInsight.news_items ?? []).length"
                                class="space-y-2"
                            >
                                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Actualités & veille
                                </h4>
                                <ul class="space-y-2">
                                    <li
                                        v-for="item in aiInsight.news_items"
                                        :key="item.url"
                                        class="rounded-md border bg-background px-3 py-2 text-sm"
                                    >
                                        <div class="flex flex-wrap items-start justify-between gap-2">
                                            <a
                                                :href="item.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="font-medium text-primary underline"
                                            >
                                                {{ item.title }}
                                            </a>
                                            <span
                                                v-if="item.source_name"
                                                class="text-[10px] uppercase tracking-wide text-muted-foreground"
                                            >
                                                {{ item.source_name }}
                                            </span>
                                        </div>
                                        <p
                                            v-if="item.summary"
                                            class="mt-1 text-xs text-muted-foreground leading-relaxed"
                                        >
                                            {{ item.summary }}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <p
                                v-else-if="aiInsight.status === 'completed'"
                                class="text-sm text-muted-foreground"
                            >
                                Aucune actualité trouvée.
                            </p>

                            <div
                                v-if="(aiInsight.job_items ?? []).length"
                                class="space-y-2"
                            >
                                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Offres d'emploi
                                </h4>
                                <ul class="space-y-2">
                                    <li
                                        v-for="item in aiInsight.job_items"
                                        :key="item.url"
                                        class="rounded-md border bg-background px-3 py-2 text-sm"
                                    >
                                        <div class="flex flex-wrap items-start justify-between gap-2">
                                            <a
                                                :href="item.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="font-medium text-primary underline"
                                            >
                                                {{ item.title }}
                                            </a>
                                            <span
                                                v-if="item.source_name"
                                                class="text-[10px] uppercase tracking-wide text-muted-foreground"
                                            >
                                                {{ item.source_name }}
                                            </span>
                                        </div>
                                        <p
                                            v-if="item.summary"
                                            class="mt-1 text-xs text-muted-foreground leading-relaxed"
                                        >
                                            {{ item.summary }}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <p
                                v-else-if="aiInsight.status === 'completed'"
                                class="text-sm text-muted-foreground"
                            >
                                Aucune offre d'emploi trouvée.
                            </p>
                        </template>

                        <p
                            v-else-if="aiInsight?.status === 'failed'"
                            class="text-sm text-destructive"
                        >
                            {{ aiInsight.error_message ?? 'La veille IA a échoué.' }}
                        </p>

                        <p
                            v-else
                            class="text-sm text-muted-foreground"
                        >
                            Aucune veille enregistrée. Cliquez sur « Mettre à jour via IA ».
                        </p>
                    </section>

                    <section class="rounded-lg border p-4 space-y-3">
                        <h3 class="text-sm font-semibold text-primary">
                            Historique des contacts
                        </h3>
                        <div
                            v-if="historiesLoading"
                            class="flex justify-center py-8"
                        >
                            <RollingLoader :loading="true" />
                        </div>
                        <CrmHistoryEntryList
                            v-else
                            :entries="histories"
                        />
                    </section>
                </div>
            </template>
        </DialogContent>

        <CommercialQuickActionDialog
            v-if="commercialUserId"
            v-model:open="commercialDialogOpen"
            :user-id="commercialUserId"
            :crm-user-id="activeCrmUserId"
            :entity-label="entityLabel"
            :client-type="commercialClientType"
            :initial-counters="weeklyCounters"
            @crm-updated="onCommercialUpdated"
        />
    </Dialog>
</template>

<script setup lang="ts">
import { formatToDMY } from '@/composables/useDate';
import type { CrmHistoryEntry } from '@/composables/useCrm';
import type { CrmInstitution, User } from '~/lib/types';
import { formatPhoneNumber } from '~/lib/utils';
import CrmHistoryEntryList from '@/components/crm/CrmHistoryEntryList.vue';
import CommercialQuickActionDialog from '@/components/crm/CommercialQuickActionDialog.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import { Button } from '@/components/ui/button';

const {
    open,
    profileType,
    profileUser,
    profileInstitution,
    dispatchAction,
    closeProfile,
} = useCrmProfile();

const { getCrmHistories, ensureCrmInstitutionContact } = useCrm();
const { getInsight, refreshInsight } = useInstitutionAiInsight();
const { $toast } = useNuxtApp();

const loading = ref(false);
const historiesLoading = ref(false);
const histories = ref<CrmHistoryEntry[]>([]);
const activeCrmUserId = ref<number | null>(null);
const commercialUserId = ref<number | null>(null);
const commercialClientType = ref('user');
const commercialDialogOpen = ref(false);

const activeUser = ref<User | null>(null);
const activeInstitution = ref<CrmInstitution | null>(null);

const aiInsight = ref<Awaited<ReturnType<typeof getInsight>>>(null);
const aiLoading = ref(false);
const aiRefreshing = ref(false);

const isUser = computed(() => profileType.value === 'user');
const isInstitution = computed(() => profileType.value === 'institution');

const entityLabel = computed(() => {
    if (isUser.value) {
        return activeUser.value?.full_name ?? profileUser.value?.full_name ?? '';
    }
    return activeInstitution.value?.full_name ?? profileInstitution.value?.full_name ?? '';
});

const profileSubtitle = computed(() => {
    if (isUser.value && activeUser.value) {
        const parts = [activeUser.value.email, formatPhoneNumber(activeUser.value.phone_number ?? null)].filter(Boolean);
        const location = [activeUser.value.zip_code, activeUser.value.city].filter(Boolean).join(' ');
        if (location) {
            parts.push(location);
        }
        return parts.join(' · ');
    }
    if (isInstitution.value && activeInstitution.value) {
        const parts = [
            activeInstitution.value.email,
            formatPhoneNumber(activeInstitution.value.phone_number ?? null),
            [activeInstitution.value.zip_code, activeInstitution.value.city].filter(Boolean).join(' '),
        ].filter(Boolean);
        if (activeInstitution.value.company_number) {
            parts.push(`BCE ${activeInstitution.value.company_number}`);
        }
        if (activeInstitution.value.status_label) {
            parts.push(activeInstitution.value.status_label);
        }
        return parts.join(' · ');
    }
    return '';
});

const institutionAdminUrl = computed(() => {
    const id = activeInstitution.value?.id ?? profileInstitution.value?.id;
    return id ? `/dashboard/admin/institutions/${id}/show` : null;
});

const referrerLabel = computed(() => {
    const ref = isUser.value
        ? activeUser.value?.referred_by ?? profileUser.value?.referred_by
        : activeInstitution.value?.referred_by ?? profileInstitution.value?.referred_by;
    return ref?.full_name ?? '—';
});

const registrationSourceLabel = computed(() => {
    const source = activeInstitution.value?.registration_source;
    if (source === 'site') {
        return 'Site web';
    }
    if (source === 'file') {
        return 'Import fichier';
    }
    return source ?? '—';
});

const productSummaryLines = computed(() => {
    const summary = isUser.value
        ? activeUser.value?.product_activity_summary
        : activeInstitution.value?.product_activity_summary;
    if (!summary?.length) {
        return [];
    }
    return summary.map(item => `${item.product_name ?? 'Produit'} : ${item.active ? 'Actif' : 'Inactif'}`);
});

const crmData = computed(() => {
    if (isUser.value) {
        return activeUser.value?.crm ?? profileUser.value?.crm ?? null;
    }
    return activeInstitution.value?.crm ?? profileInstitution.value?.crm ?? null;
});

const weeklyCounters = computed(() => {
    const crm = crmData.value;
    if (!crm) {
        return null;
    }
    return {
        nb_call: Number(crm.nb_call) || 0,
        nb_sale: Number(crm.nb_sale) || 0,
        nb_recommandation: Number(crm.nb_recommandation) || 0,
        nb_meeting: Number(crm.nb_meeting) || 0,
        nb_pending: Number(crm.nb_pending) || 0,
    };
});

const weeklyCounterItems = computed(() => {
    const c = weeklyCounters.value;
    if (!c) {
        return [];
    }
    return [
        { label: 'Appels', value: c.nb_call },
        { label: 'Ventes', value: c.nb_sale },
        { label: 'Recommand.', value: c.nb_recommandation },
        { label: 'RDV', value: c.nb_meeting },
        { label: 'En attente', value: c.nb_pending },
    ];
});

const lastContactLabel = computed(() => {
    const crm = crmData.value;
    if (!crm?.last_contact_date) {
        return '—';
    }
    const method = crm.last_contact_method ? ` (${crm.last_contact_method})` : '';
    return `${formatToDMY(crm.last_contact_date)}${method}`;
});

const lastCommentText = computed(() => {
    if (isUser.value) {
        return activeUser.value?.last_comment?.content
            ?? activeUser.value?.comment_crm
            ?? crmData.value?.last_comment
            ?? '';
    }
    return activeInstitution.value?.last_comment?.content
        ?? crmData.value?.last_comment
        ?? '';
});

async function resolveInstitutionContact(institution: CrmInstitution): Promise<CrmInstitution> {
    if (institution.representative_user_id && institution.crm?.id) {
        return institution;
    }

    const email = institution.email?.trim();
    if (!email) {
        return institution;
    }

    try {
        const response = await ensureCrmInstitutionContact(institution.id);
        return {
            ...institution,
            representative_user_id: response.representative_user_id ?? institution.representative_user_id,
            crm: {
                ...(institution.crm ?? {} as NonNullable<CrmInstitution['crm']>),
                id: response.crm?.id ?? institution.crm?.id ?? 0,
                user_id: response.representative_user_id ?? institution.representative_user_id ?? 0,
                client_type: response.crm?.client_type ?? institution.crm?.client_type ?? 'user',
                nb_call: response.crm?.nb_call ?? institution.crm?.nb_call,
                nb_sale: response.crm?.nb_sale ?? institution.crm?.nb_sale,
                nb_recommandation: response.crm?.nb_recommandation ?? institution.crm?.nb_recommandation,
                nb_meeting: response.crm?.nb_meeting ?? institution.crm?.nb_meeting,
                nb_pending: response.crm?.nb_pending ?? institution.crm?.nb_pending,
                last_contact_date: response.crm?.last_contact_date ?? institution.crm?.last_contact_date,
                last_contact_method: response.crm?.last_contact_method ?? institution.crm?.last_contact_method,
                last_comment: institution.crm?.last_comment,
                created_at: institution.crm?.created_at ?? '',
            },
        };
    }
    catch {
        return institution;
    }
}

async function loadHistories() {
    if (!activeCrmUserId.value) {
        histories.value = [];
        return;
    }

    historiesLoading.value = true;
    try {
        histories.value = await getCrmHistories(activeCrmUserId.value);
    }
    catch {
        histories.value = [];
        $toast({
            description: 'Impossible de charger l\'historique.',
            variant: 'destructive',
        });
    }
    finally {
        historiesLoading.value = false;
    }
}

async function loadAiInsight() {
    if (!isInstitution.value) {
        aiInsight.value = null;
        return;
    }

    const institutionId = activeInstitution.value?.id ?? profileInstitution.value?.id;
    if (!institutionId) {
        return;
    }

    aiLoading.value = true;
    try {
        aiInsight.value = await getInsight(institutionId);
    }
    finally {
        aiLoading.value = false;
    }
}

async function refreshAiInsight() {
    const institutionId = activeInstitution.value?.id ?? profileInstitution.value?.id;
    if (!institutionId) {
        return;
    }

    aiRefreshing.value = true;
    try {
        aiInsight.value = await refreshInsight(institutionId);
        $toast({ description: 'Veille IA mise à jour.' });
    }
    catch (error: unknown) {
        const message = (error as { data?: { message?: string } })?.data?.message;
        $toast({
            description: message ?? 'Impossible de mettre à jour la veille IA.',
            variant: 'destructive',
        });
    }
    finally {
        aiRefreshing.value = false;
    }
}

async function initializeProfile() {
    loading.value = true;
    try {
        if (isUser.value && profileUser.value) {
            activeUser.value = { ...profileUser.value };
            activeInstitution.value = null;
            commercialUserId.value = activeUser.value.id;
            activeCrmUserId.value = activeUser.value.crm?.id ?? null;
            commercialClientType.value = activeUser.value.crm?.client_type ?? 'user';
        }
        else if (isInstitution.value && profileInstitution.value) {
            activeInstitution.value = await resolveInstitutionContact({ ...profileInstitution.value });
            activeUser.value = null;
            commercialUserId.value = activeInstitution.value.representative_user_id ?? null;
            activeCrmUserId.value = activeInstitution.value.crm?.id ?? null;
            commercialClientType.value = activeInstitution.value.crm?.client_type ?? 'user';
            await loadAiInsight();
        }

        await loadHistories();
    }
    finally {
        loading.value = false;
    }
}

function emitProfileAction(type: 'contact' | 'comment' | 'referrer') {
    if (isUser.value && activeUser.value) {
        dispatchAction({ type, user: activeUser.value });
        return;
    }
    if (isInstitution.value && activeInstitution.value) {
        dispatchAction({ type, institution: activeInstitution.value });
    }
}

function onCommercialUpdated(crm: Record<string, unknown>) {
    if (isUser.value && activeUser.value) {
        activeUser.value = { ...activeUser.value, crm: { ...activeUser.value.crm, ...crm } as User['crm'] };
    }
    else if (isInstitution.value && activeInstitution.value) {
        activeInstitution.value = {
            ...activeInstitution.value,
            crm: { ...activeInstitution.value.crm, ...crm } as CrmInstitution['crm'],
        };
    }
    void loadHistories();
}

function onOpenChange(value: boolean) {
    if (!value) {
        closeProfile();
        commercialDialogOpen.value = false;
        return;
    }
    void initializeProfile();
}

watch(open, (isOpen) => {
    if (isOpen) {
        void initializeProfile();
    }
});
</script>
