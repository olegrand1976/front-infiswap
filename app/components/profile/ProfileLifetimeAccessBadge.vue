<script setup lang="ts">
import { Medal } from 'lucide-vue-next';
import { hasVerifiedMemberBadge } from '~/utils/platformAccess';

const props = withDefaults(
    defineProps<{
        /** sm = avatar header ; lg = photo profil paramètres */
        size?: 'sm' | 'lg';
        /** Force l'animation de révélation. */
        reveal?: boolean;
        /** Seule instance autorisée à consommer le flag session (header dashboard). */
        sessionConsumer?: boolean;
    }>(),
    { size: 'sm', reveal: false, sessionConsumer: false },
);

const user = useUser();
const { shouldPlayRevealAnimation, consumeRevealAnimation } = useLifetimeBadgeReveal();

const showVerifiedBadge = computed(() => hasVerifiedMemberBadge(user.value));

const isAnimating = ref(false);
const hasPlayedReveal = ref(false);
let animationTimer: ReturnType<typeof setTimeout> | null = null;

const badgeClass = computed(() =>
    props.size === 'lg'
        ? 'size-7 sm:size-8 border-[2.5px]'
        : 'size-5 sm:size-6 border-2',
);

const iconClass = computed(() =>
    props.size === 'lg'
        ? 'size-3.5 sm:size-4'
        : 'size-3 sm:size-3.5',
);

function playRevealAnimation(): void {
    if (hasPlayedReveal.value) {
        return;
    }

    hasPlayedReveal.value = true;
    isAnimating.value = true;

    if (animationTimer) {
        clearTimeout(animationTimer);
    }

    animationTimer = setTimeout(() => {
        isAnimating.value = false;
    }, 1400);
}

function tryRevealFromSession(): void {
    if (props.reveal || !props.sessionConsumer || !showVerifiedBadge.value || !shouldPlayRevealAnimation()) {
        return;
    }

    consumeRevealAnimation();
    playRevealAnimation();
}

function maybePlayPropReveal(): void {
    if (props.reveal && showVerifiedBadge.value) {
        playRevealAnimation();
    }
}

watch([() => props.reveal, showVerifiedBadge], () => {
    if (props.reveal) {
        maybePlayPropReveal();
        return;
    }

    if (props.sessionConsumer && showVerifiedBadge.value) {
        tryRevealFromSession();
    }
});

onMounted(() => {
    if (props.reveal) {
        maybePlayPropReveal();
        return;
    }

    tryRevealFromSession();
});

onBeforeUnmount(() => {
    if (animationTimer) {
        clearTimeout(animationTimer);
    }
});
</script>

<template>
    <div class="relative inline-flex shrink-0">
        <slot />

        <span
            v-if="isAnimating"
            class="pointer-events-none absolute -bottom-1 -right-1 z-[9] size-8 sm:size-10 rounded-full bg-amber-400/30 lifetime-badge-ping"
            aria-hidden="true"
        />

        <span
            v-if="showVerifiedBadge"
            class="absolute -bottom-0.5 -right-0.5 z-10 flex items-center justify-center rounded-full border-white bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-md ring-1 ring-amber-300/80"
            :class="[badgeClass, { 'lifetime-badge-reveal': isAnimating }]"
            title="Membre vérifié InfiSwap"
            aria-label="Membre vérifié InfiSwap"
        >
            <Medal
                :class="[iconClass, { 'lifetime-badge-reveal-icon': isAnimating }]"
                class="text-white drop-shadow-sm"
                aria-hidden="true"
            />
        </span>
    </div>
</template>

<style scoped>
@keyframes lifetime-badge-pop {
    0% {
        transform: scale(0) rotate(-40deg);
        opacity: 0;
    }
    55% {
        transform: scale(1.15) rotate(8deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes lifetime-badge-shine {
    0%,
    100% {
        filter: brightness(1);
    }
    50% {
        filter: brightness(1.35);
    }
}

@keyframes lifetime-badge-ping {
    0% {
        transform: scale(0.6);
        opacity: 0.7;
    }
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
}

.lifetime-badge-reveal {
    animation: lifetime-badge-pop 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.lifetime-badge-reveal-icon {
    animation: lifetime-badge-shine 1.2s ease-in-out 2;
}

.lifetime-badge-ping {
    animation: lifetime-badge-ping 1s ease-out 2;
}

@media (prefers-reduced-motion: reduce) {
    .lifetime-badge-reveal,
    .lifetime-badge-reveal-icon,
    .lifetime-badge-ping {
        animation: none;
    }
}
</style>
