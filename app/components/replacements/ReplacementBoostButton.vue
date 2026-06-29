<template>
    <button
        type="button"
        class="boost-btn group relative inline-flex items-center overflow-hidden font-bold whitespace-nowrap transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 hover:scale-[1.04] active:scale-[0.97]"
        :class="boostClasses"
        title="Booster ce remplacement"
        aria-label="Booster ce remplacement"
        @click.stop="emit('boost')"
    >
        <span
            class="absolute inset-0 opacity-60 bg-[length:200%_100%] animate-[boost-shimmer_3s_ease-in-out_infinite]"
            :class="shimmerClass"
            aria-hidden="true"
        />
        <span
            class="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"
            aria-hidden="true"
        />
        <span
            class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
            aria-hidden="true"
        />

        <span
            class="relative flex items-center justify-center rounded-full bg-white/25 shadow-inner ring-1 ring-white/30 transition-all duration-300 group-hover:bg-white/35 group-hover:scale-110"
            :class="iconWrapClass"
        >
            <Rocket
                class="shrink-0 text-white drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:scale-110"
                :class="rocketClass"
                :stroke-width="2.5"
            />
        </span>
        <span
            class="relative tracking-wide drop-shadow-sm"
            :class="labelClass"
        >
            Booster
        </span>
    </button>
</template>

<script setup lang="ts">
import { Rocket } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
    variant?: 'table' | 'card';
}>(), {
    variant: 'table',
});

const emit = defineEmits<{ boost: [] }>();

const boostClasses = computed(() =>
    props.variant === 'card'
        ? 'gap-2 px-3.5 py-2 rounded-xl text-xs text-white shadow-lg shadow-amber-500/40 ring-1 ring-amber-300/50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:shadow-xl hover:shadow-amber-500/50'
        : 'gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] lg:text-xs text-white shadow-md shadow-amber-500/35 ring-1 ring-amber-300/40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/45',
);

const shimmerClass = computed(() =>
    props.variant === 'card'
        ? 'bg-gradient-to-r from-amber-400/0 via-white/20 to-amber-400/0'
        : 'bg-gradient-to-r from-amber-400/0 via-white/15 to-amber-400/0',
);

const iconWrapClass = computed(() =>
    props.variant === 'card' ? 'p-1' : 'p-0.5',
);

const rocketClass = computed(() =>
    props.variant === 'card' ? 'w-3.5 h-3.5' : 'w-3 h-3 lg:w-3.5 lg:h-3.5',
);

const labelClass = computed(() =>
    props.variant === 'card' ? 'text-xs' : 'text-[11px] lg:text-xs',
);
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

.boost-btn {
    isolation: isolate;
}
</style>
