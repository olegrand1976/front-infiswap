<script setup lang="ts">
import { HeartHandshake, Star, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    getGoogleReviewCopy,
    GOOGLE_REVIEW_URL,
    type GoogleReviewSource,
} from '~/utils/googleReview';
import { formatSponsorshipAmount } from '~/utils/sponsorship';

const route = useRoute();

const {
    activeEngagement,
    shouldShowReviewSection,
    shouldShowSponsorSection,
    markReviewLeft,
    dismissEngagement,
} = usePostSuccessEngagement();
const { plans, loadingPlans, checkoutLoading, fetchPlans, checkout } = useSponsorship();
const { trackEvent } = useProductAnalytics();
const { $toast } = useNuxtApp();

const titleId = `success-engagement-title-${useId()}`;
const markingReview = ref(false);

const source = computed<GoogleReviewSource | null>(() => activeEngagement.value?.source ?? null);
const reviewCopy = computed(() => (source.value ? getGoogleReviewCopy(source.value) : null));

function onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        void dismissEngagement();
    }
}

async function handleReviewClick() {
    if (!source.value || markingReview.value) {
        return;
    }

    markingReview.value = true;

    try {
        await markReviewLeft(source.value);
        window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    }
    catch {
        $toast({
            title: 'Impossible d\'enregistrer votre réponse. Réessayez ou reconnectez-vous.',
            variant: 'destructive',
        });
    }
    finally {
        markingReview.value = false;
    }
}

async function handleSponsorClick(planId: number, amount: number) {
    if (!source.value || checkoutLoading.value) {
        return;
    }

    trackEvent('sponsorship_tier_click', { source: source.value, amount });

    await checkout(planId, route.fullPath, source.value);
}

onMounted(async () => {
    window.addEventListener('keydown', onEscape);
    await fetchPlans();
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onEscape);
});

watch(source, (nextSource) => {
    if (nextSource) {
        trackEvent('google_review_impression', { source: nextSource });
        trackEvent('sponsorship_impression', { source: nextSource });
    }
}, { immediate: true });
</script>

<template>
    <div
        v-if="source"
        class="relative flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-6 pt-14 text-center"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
    >
        <button
            type="button"
            class="fixed right-4 top-4 z-[120] rounded-full border border-border/60 bg-white p-2 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
            aria-label="Fermer"
            :disabled="markingReview || checkoutLoading"
            @click="dismissEngagement"
        >
            <X class="size-5" />
        </button>

        <div class="flex flex-1 flex-col justify-center space-y-8 overflow-y-auto animate-in fade-in duration-500">
        <template v-if="shouldShowReviewSection && reviewCopy">
            <div class="space-y-6">
                <div class="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    <Star class="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    Votre avis compte
                </div>

                <div class="space-y-2">
                    <h2
                        :id="titleId"
                        class="text-xl sm:text-2xl font-semibold text-primary"
                    >
                        {{ reviewCopy.title }}
                    </h2>
                    <p class="text-sm text-muted-foreground leading-relaxed">
                        {{ reviewCopy.subtitle }}
                    </p>
                </div>

                <div
                    class="flex justify-center gap-1 text-yellow-400"
                    aria-hidden="true"
                >
                    <Star
                        v-for="i in 5"
                        :key="i"
                        class="size-6 fill-yellow-400"
                    />
                </div>

                <LayoutsAppImage
                    src="/google-brand.svg"
                    class="mx-auto w-28"
                    alt="Google"
                />

                <Button
                    class="w-full max-w-xs mx-auto bg-amber-500 hover:bg-amber-600 font-semibold text-white"
                    :disabled="markingReview"
                    @click="handleReviewClick"
                >
                    Laisser un avis Google
                </Button>
            </div>

            <div
                v-if="shouldShowSponsorSection"
                class="border-t border-border/60 pt-6"
            />
        </template>

        <div
            v-if="shouldShowSponsorSection"
            class="space-y-4"
        >
            <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <HeartHandshake class="size-3.5" aria-hidden="true" />
                Soutenez InfiSwap
            </div>

            <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-semibold text-primary">
                    Aidez le réseau à grandir
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Votre sponsoring finance la visibilité d'InfiSwap auprès des infirmières.
                    Facture envoyée par e-mail pour votre comptabilité.
                </p>
            </div>

            <div
                v-if="loadingPlans"
                class="text-sm text-muted-foreground"
            >
                Chargement des paliers…
            </div>

            <div
                v-else
                class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto"
            >
                <Button
                    v-for="plan in plans"
                    :key="plan.id"
                    variant="outline"
                    class="font-semibold"
                    :disabled="checkoutLoading"
                    @click="handleSponsorClick(plan.id, plan.amount)"
                >
                    {{ formatSponsorshipAmount(plan.amount, plan.currency) }}
                </Button>
            </div>
        </div>
        </div>

        <div class="sticky bottom-0 z-10 border-t border-border/60 bg-white/95 pt-4 backdrop-blur-sm">
            <Button
                variant="ghost"
                class="w-full max-w-xs mx-auto text-muted-foreground"
                :disabled="markingReview || checkoutLoading"
                @click="dismissEngagement"
            >
                Plus tard
            </Button>
        </div>
    </div>
</template>
