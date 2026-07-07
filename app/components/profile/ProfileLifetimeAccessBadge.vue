<script setup lang="ts">
import { Medal } from 'lucide-vue-next';
import { hasLifetimeNetworkAccess } from '~/utils/platformAccess';

const props = withDefaults(
    defineProps<{
        /** sm = avatar header ; lg = photo profil paramètres */
        size?: 'sm' | 'lg';
    }>(),
    { size: 'sm' },
);

const user = useUser();

const showBadge = computed(() => hasLifetimeNetworkAccess(user.value));

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
            class="absolute -bottom-0.5 -right-0.5 z-10 flex items-center justify-center rounded-full border-white bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-md ring-1 ring-amber-300/80"
            :class="badgeClass"
            title="Inscription validée à vie — accès InfiSwap permanent"
            aria-label="Inscription validée à vie — accès InfiSwap permanent"
        >
            <Medal
                :class="iconClass"
                class="text-white drop-shadow-sm"
                aria-hidden="true"
            />
        </span>
    </div>
</template>
