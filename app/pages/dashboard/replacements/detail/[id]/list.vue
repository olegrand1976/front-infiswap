<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center gap-2 rounded-lg text-primary sm:bg-muted/50 sm:px-9">
            <ArrowLeft
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                <span class="hidden lg:inline-block">Personnes intéressées par mon remplacement</span>
                <span class="lg:hidden">Intéressés</span>
            </h1>
        </div>

        <div
            v-if="showBoostBanner"
            class="mx-2 mt-4 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
        >
            <span>Dernière chance : <strong>Boost 2 — 4,40 € / 7 j</strong> recommandé (ou Boost 1 — 2 € / 3 j).</span>
            <ReplacementBoostButton
                show-price
                @boost="goToReplacementDetail"
            />
        </div>

        <template v-if="listResponse.length != 0">
            <div class="flex items-center sm:space-x-4 lg:space-x-8 gap-2 mt-6 p-2">
                <h4 class="font-bold hidden lg:inline-block text-sm text-primary">
                    Période
                </h4>
                <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                    <span class="ms-3 text-xs text-primary-foreground">Début</span>
                    <div class="flex w-40 items-center justify-center rounded-full bg-card text-primary shadow">
                        <Calendar class="w-4 h-4 ml-1 text-primary" />
                        <div class="flex h-9 w-24 items-center rounded-full bg-card text-xs text-primary">
                            {{ startDate }}
                        </div>
                    </div>
                </div>
                <span class="text-primary">au</span>
                <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                    <span class="ms-3 text-xs text-primary-foreground">Fin</span>
                    <div class="flex w-40 items-center justify-center rounded-full bg-card text-primary shadow">
                        <Calendar class="w-4 h-4 ml-1 text-primary" />
                        <div class="flex h-9 w-24 items-center rounded-full bg-card text-xs text-primary">
                            {{ endDate }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="mt-8 mb-12 p-2">
            <template v-if="listResponse.length != 0">
                <div
                    class="grid grid-cols-1 items-stretch gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                >
                    <div
                        v-for="(list, index) in sortedListResponse"
                        :key="list.id ?? index"
                        class="flex h-full min-h-0 w-full max-w-[17.5rem] flex-col rounded-md bg-muted/50 text-foreground shadow-md"
                    >
                        <div class="flex min-h-0 flex-1 flex-col px-2 pt-2">
                            <ReplacementsInstitutionResponseCard
                                v-if="isInstitutionRespondent(list)"
                                class="h-full min-h-0 w-full flex-1"
                                compact
                                :institution="list.respondent"
                                :show-full-info="true"
                            />
                            <UsersCard
                                v-else
                                class="h-full min-h-0 w-full flex-1"
                                compact
                                :user="list.respondent"
                                :show-full-info="true"
                            />
                        </div>

                        <div class="px-2 pt-1 text-xs text-muted-foreground text-center">
                            Réponse reçue le {{ list.responded_at }}
                        </div>

                        <div class="mx-auto mt-auto flex min-h-[3.75rem] w-full max-w-[260px] shrink-0 flex-col justify-center border-t border-border/60 px-2 pb-2 pt-2">
                            <div
                                v-if="list.status==='confirmed'"
                                class="mx-auto flex w-full items-center justify-center gap-1.5 text-sm text-success"
                            >
                                <CircleCheck class="size-5 shrink-0" /> <span>Accepté</span>
                            </div>
                            <div
                                v-else-if="list.status==='refused'"
                                class="mx-auto flex w-full items-center justify-center gap-1.5 text-sm font-bold text-primary"
                            >
                                <X class="size-5 shrink-0" /> <span>Refusé</span>
                            </div>
                            <div
                                v-if="!hasConfirmed() && list.status !== 'refused'"
                                class="mt-1 flex w-full justify-center gap-2"
                            >
                                <Button
                                    size="sm"
                                    class="w-1/2 hover:bg-primary/90"
                                    :class="{ 'opacity-50 cursor-not-allowed': loading }"
                                    @click="updateStatus(list.id, 'refused')"
                                >
                                    Refuser
                                </Button>
                                <Button
                                    size="sm"
                                    class="w-1/2 bg-success hover:bg-success/90"
                                    :class="{ 'opacity-50 cursor-not-allowed': loading }"
                                    @click="openAcceptModal(list)"
                                >
                                    Accepter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <span class="mx-auto mt-8 flex items-center justify-center text-muted-foreground">
                    Aucune liste à afficher pour le moment
                </span>
            </template>
        </div>

        <ReplacementAcceptModal
            v-model:open="acceptModalOpen"
            :response="selectedResponse"
            :replacement-id="replacementId"
            :is-institution-respondent="selectedResponse ? isInstitutionRespondent(selectedResponse) : false"
            @accepted="onAccepted"
        />
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Calendar, CircleCheck, X } from 'lucide-vue-next';
import { getErrorMessage, goBack } from '~/lib/utils';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import ReplacementAcceptModal from '~/components/replacements/ReplacementAcceptModal.vue';
import ReplacementBoostButton from '~/components/replacements/ReplacementBoostButton.vue';
import { isReplacementActivelyBoosted } from '~/lib/replacementBoost';
import { extractStripeSessionId, isStripeCheckoutSessionId } from '~/utils/accessReturn';
import {
    buildAnalyticsSeenKey,
    buildContractCelebrationDedupeKey,
    shouldTrackPurchaseAnalytics,
} from '~/utils/purchaseCelebration';
import type { Replacement, ReplacementResponse } from '~/lib/types';

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const router = useRouter();
const replacementId = route.params.id;
const { $toast } = useNuxtApp();
const { trackEvent } = useProductAnalytics();
const { triggerCelebration } = usePurchaseCelebration();
const { requestPrompt } = useGoogleReviewPrompt();
const { confirmContract } = useReplacementContract();

function trackContractPaidOnce(sessionId: string) {
    if (!import.meta.client) {
        return;
    }

    const key = buildAnalyticsSeenKey('contract', sessionId);

    if (!shouldTrackPurchaseAnalytics(sessionId, sessionStorage.getItem(key))) {
        return;
    }

    trackEvent('contract_paid', { replacement_id: String(replacementId) });
    sessionStorage.setItem(key, sessionId);
}

async function processContractReturn() {
    if (route.query.contract !== 'success') {
        return;
    }

    const sessionId = extractStripeSessionId(route.query);

    if (!sessionId || !isStripeCheckoutSessionId(sessionId)) {
        await router.replace({ path: route.path, query: {} });
        return;
    }

    let granted = false;

    for (let attempt = 0; attempt < 4; attempt++) {
        const { outcome } = await confirmContract(sessionId);

        if (outcome === 'active') {
            granted = true;
            break;
        }

        if (outcome === 'auth_error') {
            break;
        }

        if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    await fetchListResponse();
    await router.replace({ path: route.path, query: {} });

    if (!granted) {
        return;
    }

    trackContractPaidOnce(sessionId);
    triggerCelebration({
        variant: 'contract',
        replacementId: Number(replacementId),
        dedupeKey: buildContractCelebrationDedupeKey(Number(replacementId), sessionId),
    });
}

const { loading, listResponse, fetchListResponse } = useListResponse(replacementId);

const acceptModalOpen = ref(false);
const selectedResponse = ref<ReplacementResponse | null>(null);

const replacementParent = computed(() => listResponse.value?.[0]?.parent as Replacement | undefined);

const pendingCount = computed(() =>
    (listResponse.value ?? []).filter(item => item.status === 'pending').length,
);

const showBoostBanner = computed(() => {
    const parent = replacementParent.value;
    if (!parent || pendingCount.value === 0) return false;
    if (parent.status !== 'open') return false;
    return !isReplacementActivelyBoosted(parent);
});

const sortedListResponse = computed(() => {
    const items = [...(listResponse.value || [])];
    items.sort((a, b) => {
        const aInst = isInstitutionRespondent(a);
        const bInst = isInstitutionRespondent(b);
        if (aInst !== bInst) return aInst ? -1 : 1;
        return 0;
    });
    return items;
});

const isInstitutionRespondent = (response: ReplacementResponse) => response.respondent?.type === 'institution';

function openAcceptModal(response: ReplacementResponse) {
    selectedResponse.value = response;
    acceptModalOpen.value = true;
}

async function onAccepted() {
    await fetchListResponse();
    $toast({ description: 'Statut modifié avec succès' });
    requestPrompt('replacement_accepted');
}

function goToReplacementDetail() {
    trackEvent('boost_cta_click', { source: 'candidate_list', plan_days: 7, plan_amount: 4.4 });
    router.push(`/dashboard/replacements/detail/${replacementId}?boost=offer`);
}

const updateStatus = async (id: number, status: string) => {
    try {
        await changeStatus(id, status);
        await fetchListResponse();
        $toast({
            description: 'Statut modifié avec succès',
        });
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
        console.error(error);
    }
};

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const startDate = computed(() => {
    if (!listResponse.value?.length) return '';
    const parent = listResponse.value[0].parent;

    if (!parent.start_date && parent.periods?.length) {
        return formatDate(parent.periods[0].start_date);
    }
    return parent.start_date ? formatDate(parent.start_date) : '';
});

const endDate = computed(() => {
    if (!listResponse.value?.length) return '';
    const parent = listResponse.value[0].parent;

    if (!parent.end_date && parent.periods?.length) {
        return formatDate(parent.periods[parent.periods.length - 1].end_date);
    }
    return parent.end_date ? formatDate(parent.end_date) : '';
});

const hasConfirmed = () =>
    listResponse.value?.some(item => item.status === 'confirmed');

onMounted(async () => {
    if (route.query.contract === 'success') {
        await processContractReturn();
    }
});

useHead({
    title: 'Liste des personnes intéréssées par le remplacement',
});

await fetchListResponse();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
