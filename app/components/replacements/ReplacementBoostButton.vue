<template>
    <button
        type="button"
        class="inline-flex items-center gap-1.5 font-bold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:scale-[1.03] active:scale-[0.98]"
        :class="boostClasses"
        title="Booster ce remplacement"
        @click.stop="emit('boost')"
    >
        <Rocket class="shrink-0 w-3.5 h-3.5" />
        <span>Booster</span>
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
        ? 'px-3 py-2 rounded-xl text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 ring-1 ring-amber-400/40'
        : 'px-2.5 py-1.5 rounded-lg text-[11px] lg:text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 ring-1 ring-amber-400/30',
);
</script>
