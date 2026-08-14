<script setup lang="ts">
import { Star } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        /** sm = avatar header ; lg = photo profil paramètres */
        size?: 'sm' | 'lg';
        /** Force l'affichage (ex. carte tierce quand l'API expose is_premium). */
        active?: boolean | null;
    }>(),
    { size: 'sm', active: null },
);

const { t } = useI18n();
const { isPremium } = useProSubscription();

const showPremiumBadge = computed(() =>
    props.active === null ? isPremium.value === true : props.active === true,
);

const memberLabel = computed(() => t('premiumMarketing.memberLabel'));

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
            class="absolute z-10 flex items-center justify-center rounded-full border-white bg-amber-400 shadow-md ring-1 ring-amber-500/40"
            :class="badgeClass"
            :title="memberLabel"
            :aria-label="memberLabel"
        >
            <Star
                :class="iconClass"
                class="fill-amber-50 text-amber-50 drop-shadow-sm"
                aria-hidden="true"
            />
        </span>
    </div>
</template>
