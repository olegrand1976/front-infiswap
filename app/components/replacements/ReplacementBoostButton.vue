<template>
    <button
        v-if="isBoosted"
        type="button"
        class="inline-flex items-center gap-1.5 font-bold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        :class="[boostedClasses, cancelable ? 'cursor-pointer hover:brightness-95' : 'cursor-default']"
        :title="cancelable ? 'Cliquer pour annuler la mise en avant' : 'Mise en avant active'"
        @click="cancelable ? emit('cancel') : undefined"
    >
        <Zap class="shrink-0 fill-current" :class="iconSize" />
        <span>En avant</span>
    </button>

    <button
        v-else-if="canBoost"
        type="button"
        class="inline-flex items-center gap-1.5 font-bold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:scale-[1.03] active:scale-[0.98]"
        :class="boostClasses"
        @click="emit('boost')"
    >
        <Rocket class="shrink-0" :class="iconSize" />
        <span>Booster</span>
        <span
            v-if="priceLabel"
            class="opacity-90 font-semibold"
            :class="variant === 'card' ? 'text-[10px]' : 'text-[10px] lg:text-xs'"
        >
            {{ priceLabel }}
        </span>
    </button>
</template>

<script setup lang="ts">
import { Rocket, Zap } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
    canBoost?: boolean;
    isBoosted?: boolean;
    priceLabel?: string | null;
    variant?: 'table' | 'card';
    cancelable?: boolean;
}>(), {
    canBoost: false,
    isBoosted: false,
    priceLabel: null,
    variant: 'table',
    cancelable: true,
});

const emit = defineEmits<{
    boost: [];
    cancel: [];
}>();

const iconSize = computed(() => (props.variant === 'card' ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'));

const boostClasses = computed(() =>
    props.variant === 'card'
        ? 'px-3 py-2 rounded-xl text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 ring-1 ring-amber-400/40'
        : 'px-2.5 py-1.5 rounded-lg text-[11px] lg:text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 ring-1 ring-amber-400/30',
);

const boostedClasses = computed(() =>
    props.variant === 'card'
        ? 'px-3 py-2 rounded-xl text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-300 shadow-sm'
        : 'px-2.5 py-1.5 rounded-lg text-[11px] lg:text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-300 shadow-sm',
);
</script>
