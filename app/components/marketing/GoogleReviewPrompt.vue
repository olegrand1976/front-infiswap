<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    getGoogleReviewCopy,
    GOOGLE_REVIEW_URL,
    type GoogleReviewSource,
} from '~/utils/googleReview';

const { activePrompt, markReviewLeft, dismissPrompt } = useGoogleReviewPrompt();
const { trackEvent } = useProductAnalytics();

const titleId = `google-review-title-${useId()}`;
const marking = ref(false);

const source = computed<GoogleReviewSource | null>(() => activePrompt.value?.source ?? null);
const copy = computed(() => (source.value ? getGoogleReviewCopy(source.value) : null));

function onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        void dismissPrompt();
    }
}

async function handleReviewClick() {
    if (!source.value || marking.value) {
        return;
    }

    marking.value = true;

    try {
        window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
        await markReviewLeft(source.value);
    }
    finally {
        marking.value = false;
    }
}

onMounted(() => {
    window.addEventListener('keydown', onEscape);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onEscape);
});

watch(source, (nextSource) => {
    if (nextSource) {
        trackEvent('google_review_impression', { source: nextSource });
    }
}, { immediate: true });
</script>

<template>
    <div
        v-if="copy && source"
        class="max-w-md mx-auto text-center py-10 lg:py-12 px-4 space-y-6 animate-in fade-in duration-500"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
    >
        <div class="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Star class="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            Votre avis compte
        </div>

        <div class="space-y-2">
            <h2
                :id="titleId"
                class="text-xl sm:text-2xl font-semibold text-primary"
            >
                {{ copy.title }}
            </h2>
            <p class="text-sm text-muted-foreground leading-relaxed">
                {{ copy.subtitle }}
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

        <div class="flex flex-col gap-2 max-w-xs mx-auto">
            <Button
                class="w-full bg-amber-500 hover:bg-amber-600 font-semibold text-white"
                :disabled="marking"
                @click="handleReviewClick"
            >
                Laisser un avis Google
            </Button>
            <Button
                variant="ghost"
                class="w-full text-muted-foreground"
                :disabled="marking"
                @click="dismissPrompt"
            >
                Plus tard
            </Button>
        </div>
    </div>
</template>
