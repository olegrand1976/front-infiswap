<template>
    <div
        v-if="visible"
        class="mx-3 mb-3 rounded-xl overflow-hidden border border-amber-300/40 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/25"
    >
        <div class="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-3 py-2.5 sm:px-4 sm:py-3">
            <span
                class="pointer-events-none absolute inset-0 bg-[length:200%_100%] animate-[boost-shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-amber-400/0 via-white/10 to-amber-400/0"
                aria-hidden="true"
            />

            <div class="relative flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                <div
                    class="flex shrink-0 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/30 shadow-inner"
                    :class="isBoosted ? 'w-10 h-10' : 'w-9 h-9'"
                >
                    <Rocket
                        class="h-4 w-4 text-white drop-shadow-sm"
                        :stroke-width="2.5"
                    />
                </div>

                <div class="min-w-0 flex-1 text-white">
                    <p class="font-bold text-sm sm:text-base leading-tight">
                        {{ title }}
                    </p>
                    <p class="mt-0.5 text-xs text-white/90 leading-snug">
                        {{ subtitle }}
                    </p>
                </div>

                <div
                    v-if="isOwner"
                    class="shrink-0"
                >
                    <ReplacementBoostButton
                        v-if="canBoost && !isBoosted"
                        variant="detail"
                        show-price
                        @boost="onBoostClick"
                    />
                    <Button
                        v-else-if="isBoosted"
                        variant="outline"
                        type="button"
                        :class="actionButtonClass"
                        @click="emit('manage')"
                    >
                        {{ t('replacements.detailBoostBlock.manageBoostBtn') }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Rocket } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ReplacementBoostButton from '@/components/replacements/ReplacementBoostButton.vue';
import { isReplacementActivelyBoosted } from '~/lib/replacementBoost';
import type { Replacement } from '~/lib/types';

const props = defineProps<{
    replacement: Replacement | null;
    isOwner: boolean;
    canBoost: boolean;
}>();

const emit = defineEmits<{
    boost: [];
    manage: [];
}>();

const { t } = useI18n();
const { trackEvent } = useProductAnalytics();

const actionButtonClass = 'border-white/90 bg-white text-amber-700 font-semibold shadow-sm hover:bg-amber-50 hover:text-amber-800 hover:border-white';

const isBoosted = computed(() =>
    props.replacement ? isReplacementActivelyBoosted(props.replacement) : false,
);

const responsesCount = computed(() => props.replacement?.responses_count ?? 0);

const isStaleWithoutResponses = computed(() => {
    if (!props.replacement?.created_at || responsesCount.value > 0) {
        return false;
    }

    const created = new Date(props.replacement.created_at);
    const hoursSince = (Date.now() - created.getTime()) / (1000 * 60 * 60);

    return hoursSince >= 12;
});

const visible = computed(() => {
    if (!props.replacement) return false;
    if (isBoosted.value) return true;
    return props.isOwner && props.canBoost;
});

const title = computed(() => {
    if (isBoosted.value) {
        return props.isOwner ? t('replacements.boostedTitle') : t('replacements.detailBoostBlock.titleBoostedVisitor');
    }

    if (responsesCount.value === 0 && isStaleWithoutResponses.value) {
        return t('replacements.detailBoostBlock.titleNoResponsesStale');
    }

    return t('replacements.detailBoostBlock.titleDefault');
});

const subtitle = computed(() => {
    if (isBoosted.value) {
        if (props.replacement?.boosted_until) {
            return t('replacements.activeUntil', { date: formatDate(props.replacement.boosted_until) });
        }
        return props.isOwner
            ? t('replacements.detailBoostBlock.subtitleOwnerBoosted')
            : t('replacements.detailBoostBlock.subtitleVisitorBoosted');
    }

    const boostOptions = t('replacements.detailBoostBlock.boostOptionsText');

    if (responsesCount.value === 0) {
        if (isStaleWithoutResponses.value) {
            return t('replacements.detailBoostBlock.subtitleStaleWithOptions', { options: boostOptions });
        }
        return t('replacements.detailBoostBlock.subtitleLaunchVisibility', { options: boostOptions });
    }

    return t('replacements.detailBoostBlock.subtitleWithResponses', { n: responsesCount.value, options: boostOptions });
});

watch(visible, (isVisible) => {
    if (isVisible && props.replacement?.id) {
        trackEvent('boost_impression', {
            source: 'detail_block',
            replacement_id: String(props.replacement.id),
            responses_count: responsesCount.value,
            boost_tier: 'boost2',
        });
    }
}, { immediate: true });

function onBoostClick() {
    if (props.replacement?.id) {
        trackEvent('boost_cta_click', {
            source: 'detail_block',
            plan_days: 7,
            plan_amount: 4.4,
        });
    }
    emit('boost');
}

function formatDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
</script>

<style scoped>
@keyframes boost-shimmer {
    0%, 100% {
        background-position: 200% 0;
    }
    50% {
        background-position: -200% 0;
    }
}
</style>
