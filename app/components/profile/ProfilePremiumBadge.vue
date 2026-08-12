<script setup lang="ts">
import { Crown } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        /** sm = avatar header ; lg = photo profil paramètres */
        size?: 'sm' | 'lg';
        /** Force l'affichage (ex. carte tierce quand l'API expose is_premium). */
        active?: boolean | null;
    }>(),
    { size: 'sm', active: null },
);

const { isPremium } = useProSubscription();

const showPremiumBadge = computed(() =>
    props.active === null ? isPremium.value === true : props.active === true,
);

const badgeClass = computed(() =>
    props.size === 'lg'
        ? 'size-7 sm:size-8 border-[2.5px] -top-0.5 -left-0.5'
        : 'size-5 sm:size-6 border-2 -top-0.5 -left-0.5',
);

const iconClass = computed(() =>
    props.size === 'lg'
        ? 'size-3.5 sm:size-4'
        : 'size-3 sm:size-3.5',
);
</script>

<template>
    <div class="relative inline-flex shrink-0">
        <slot />

        <span
            v-if="showPremiumBadge"
            class="absolute z-10 flex items-center justify-center rounded-full border-white bg-primary shadow-md ring-1 ring-primary/40"
            :class="badgeClass"
            title="Infiswap Premium"
            aria-label="Infiswap Premium"
        >
            <Crown
                :class="iconClass"
                class="text-primary-foreground drop-shadow-sm"
                aria-hidden="true"
            />
        </span>
    </div>
</template>
