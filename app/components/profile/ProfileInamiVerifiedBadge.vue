<script setup lang="ts">
import { BadgeCheck } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        size?: 'sm' | 'lg';
        verified?: boolean | null;
        cobrhaEnabled?: boolean | null;
    }>(),
    { size: 'sm', verified: null, cobrhaEnabled: null },
);

const user = useUser();

const showBadge = computed(() => {
    const enabled = props.cobrhaEnabled ?? user.value?.inami_cobrha_enabled ?? false;
    const verified = props.verified ?? user.value?.identifier_verified ?? false;

    return Boolean(enabled && verified);
});

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
</script>

<template>
    <div class="relative inline-flex shrink-0">
        <slot />

        <span
            v-if="showBadge"
            class="absolute -bottom-0.5 -left-0.5 z-10 flex items-center justify-center rounded-full border-white bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 shadow-md ring-1 ring-teal-300/80"
            :class="badgeClass"
            title="Numéro INAMI vérifié"
            aria-label="Numéro INAMI vérifié"
        >
            <BadgeCheck
                :class="iconClass"
                class="text-white drop-shadow-sm"
                aria-hidden="true"
            />
        </span>
    </div>
</template>
