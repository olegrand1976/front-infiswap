<script setup lang="ts">
import { FileCheck, Sparkles } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ProfileLifetimeAccessBadge from '@/components/profile/ProfileLifetimeAccessBadge.vue';
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';
import { hasLifetimeNetworkAccess } from '~/utils/platformAccess';
import type { PurchaseCelebrationVariant } from '~/utils/purchaseCelebration';

const props = withDefaults(
    defineProps<{
        variant: PurchaseCelebrationVariant;
        displayName?: string | null;
        avatarUrl?: string | null;
        replacementId?: number;
        dedupeKey?: string;
        autoContinueMs?: number;
        autoContinueRoute?: string;
        secondaryRoute?: string;
    }>(),
    { autoContinueMs: 3500 },
);

const emit = defineEmits<{
    continue: [route: string];
}>();

const { trackEvent } = useProductAnalytics();
const { markCelebrationSeen } = usePurchaseCelebration();
const user = useUser();

const revealActive = ref(true);
const prefersReducedMotion = ref(false);
const titleId = `purchase-celebration-title-${useId()}`;
let autoTimer: ReturnType<typeof setTimeout> | null = null;

const showPaidBadge = computed(() =>
    props.variant !== 'platform_access' || hasLifetimeNetworkAccess(user.value),
);

const effectiveAutoContinueMs = computed(() =>
    prefersReducedMotion.value ? 0 : props.autoContinueMs,
);

const variantConfig = computed(() => {
    const replacementDetail = props.replacementId
        ? `/dashboard/replacements/detail/${props.replacementId}`
        : '/dashboard/replacements';
    const replacementList = props.replacementId
        ? `/dashboard/replacements/detail/${props.replacementId}/list`
        : '/dashboard/replacements';
    const secondaryTo = props.secondaryRoute ?? '/dashboard';
    const secondaryLabel = props.secondaryRoute && props.secondaryRoute !== '/dashboard'
        ? 'Retour à mon espace'
        : 'Explorer le tableau de bord';

    switch (props.variant) {
        case 'platform_access':
            return {
                chip: 'Accès activé',
                title: 'Bienvenue dans le réseau à vie',
                subtitle: props.displayName
                    ? `${props.displayName}, votre badge membre est visible sur votre profil.`
                    : 'Votre badge membre est visible sur votre profil.',
                tips: [
                    'Publiez une annonce pour être visible par les collègues de votre zone.',
                    'Postulez aux missions qui correspondent à vos disponibilités.',
                    'Configurez vos alertes pour ne manquer aucune opportunité.',
                ],
                primaryCta: { label: 'Publier un remplacement', to: '/dashboard/replacements/create' },
                secondaryCta: { label: secondaryLabel, to: secondaryTo },
            };
        case 'boost':
            return {
                chip: 'Boost activé',
                title: 'Votre annonce est en tête de liste',
                subtitle: 'La visibilité maximale attire plus de candidatures qualifiées.',
                tips: [
                    'Consultez les candidatures dès qu\'elles arrivent.',
                    'Partagez l\'annonce pour élargir votre bassin de remplaçants.',
                    'Répondez rapidement pour confirmer le bon profil.',
                ],
                primaryCta: { label: 'Voir les candidatures', to: replacementList },
                secondaryCta: { label: 'Rester sur l\'annonce', to: replacementDetail },
            };
        case 'contract':
            return {
                chip: 'Contrat confirmé',
                title: 'Remplacement confirmé avec contrat',
                subtitle: 'Le remplaçant est notifié et votre contrat est disponible.',
                tips: [
                    'Téléchargez et archivez le PDF pour vos dossiers.',
                    'Vérifiez les coordonnées du remplaçant sur la fiche.',
                    'Retrouvez tous vos contrats au même endroit.',
                ],
                primaryCta: { label: 'Mes contrats', to: '/dashboard/replacements/contracts' },
                secondaryCta: { label: 'Retour à l\'annonce', to: replacementDetail },
            };
        default: {
            const _exhaustive: never = props.variant;
            return _exhaustive;
        }
    }
});

const autoContinueTarget = computed(() =>
    props.autoContinueRoute ?? variantConfig.value.primaryCta.to,
);

function clearAutoTimer() {
    if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
    }
}

function handleContinue(route: string, cta: 'primary' | 'secondary' | 'dismiss') {
    clearAutoTimer();
    trackEvent('purchase_celebration_cta_click', { variant: props.variant, cta });
    emit('continue', route);
}

function onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        handleContinue(variantConfig.value.secondaryCta.to, 'dismiss');
    }
}

onMounted(() => {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (props.dedupeKey) {
        markCelebrationSeen(props.dedupeKey);
    }

    trackEvent('purchase_celebration_impression', {
        variant: props.variant,
        ...(props.replacementId ? { replacement_id: String(props.replacementId) } : {}),
    });

    window.addEventListener('keydown', onEscape);

    if (effectiveAutoContinueMs.value > 0) {
        autoTimer = setTimeout(
            () => handleContinue(autoContinueTarget.value, 'primary'),
            effectiveAutoContinueMs.value,
        );
    }
});

onBeforeUnmount(() => {
    clearAutoTimer();
    window.removeEventListener('keydown', onEscape);
});
</script>

<template>
    <div
        class="max-w-md mx-auto text-center py-12 lg:py-16 space-y-8 animate-in fade-in duration-500"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
    >
        <div class="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
            <Sparkles class="size-3.5" />
            {{ variantConfig.chip }}
        </div>

        <div class="space-y-3">
            <h1
                :id="titleId"
                class="text-2xl sm:text-3xl font-semibold text-primary"
            >
                {{ variantConfig.title }}
            </h1>
            <p class="text-muted-foreground text-sm leading-relaxed">
                {{ variantConfig.subtitle }}
            </p>
        </div>

        <div class="relative flex justify-center py-6">
            <span
                v-if="!prefersReducedMotion"
                class="pointer-events-none absolute size-36 rounded-full bg-amber-400/20 purchase-celebration-glow"
                aria-hidden="true"
            />

            <div
                v-if="variant === 'platform_access' && showPaidBadge"
                class="relative"
            >
                <ProfileLifetimeAccessBadge
                    size="lg"
                    :reveal="revealActive"
                >
                    <div class="relative size-24 sm:size-28 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-amber-300/60 bg-muted">
                        <img
                            v-if="avatarUrl"
                            :src="avatarUrl"
                            alt=""
                            class="size-full object-cover"
                        >
                        <div
                            v-else
                            class="flex size-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary"
                        >
                            {{ (displayName ?? 'M').slice(0, 1).toUpperCase() }}
                        </div>
                    </div>
                </ProfileLifetimeAccessBadge>
            </div>

            <div
                v-else-if="variant === 'platform_access'"
                class="flex size-24 sm:size-28 items-center justify-center rounded-full border-4 border-white bg-muted shadow-xl ring-2 ring-amber-300/30 animate-pulse"
            >
                <p class="px-3 text-xs text-muted-foreground">
                    Activation en cours…
                </p>
            </div>

            <div
                v-else-if="variant === 'boost'"
                :class="{ 'purchase-celebration-boost-pop': !prefersReducedMotion }"
            >
                <ReplacementBoostStars size="lg" />
            </div>

            <div
                v-else-if="variant === 'contract'"
                class="flex size-24 sm:size-28 items-center justify-center rounded-full border-4 border-white bg-success/10 shadow-xl ring-2 ring-success/30"
                :class="{ 'purchase-celebration-boost-pop': !prefersReducedMotion }"
            >
                <FileCheck class="size-12 sm:size-14 text-success" aria-hidden="true" />
            </div>
        </div>

        <ul class="space-y-2 text-left text-sm text-muted-foreground max-w-sm mx-auto">
            <li
                v-for="tip in variantConfig.tips"
                :key="tip"
                class="flex gap-2"
            >
                <span class="text-success shrink-0">✓</span>
                <span>{{ tip }}</span>
            </li>
        </ul>

        <div class="flex flex-col gap-2 max-w-xs mx-auto">
            <Button
                class="w-full bg-success hover:bg-success/90 font-semibold"
                @click="handleContinue(variantConfig.primaryCta.to, 'primary')"
            >
                {{ variantConfig.primaryCta.label }}
            </Button>
            <Button
                variant="outline"
                class="w-full"
                @click="handleContinue(variantConfig.secondaryCta.to, 'secondary')"
            >
                {{ variantConfig.secondaryCta.label }}
            </Button>
        </div>
    </div>
</template>

<style scoped>
@keyframes purchase-celebration-glow {
    0%, 100% {
        transform: scale(1);
        opacity: 0.35;
    }
    50% {
        transform: scale(1.15);
        opacity: 0.65;
    }
}

@keyframes purchase-celebration-boost-pop {
    0% {
        transform: scale(0.7);
        opacity: 0.5;
    }
    60% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.purchase-celebration-glow {
    animation: purchase-celebration-glow 1.8s ease-in-out infinite;
}

.purchase-celebration-boost-pop {
    animation: purchase-celebration-boost-pop 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
    .purchase-celebration-glow,
    .purchase-celebration-boost-pop {
        animation: none;
    }
}
</style>
