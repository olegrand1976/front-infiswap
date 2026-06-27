<template>
    <div
        v-if="isBoosted"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shadow-md ring-1 ring-amber-300/60 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white boost-badge-pulse"
        :class="sizeClasses"
    >
        <Zap
            class="fill-current shrink-0"
            :class="iconClasses"
        />
        <span>En avant</span>
    </div>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
    isBoosted?: boolean;
    size?: 'sm' | 'md';
}>(), {
    isBoosted: false,
    size: 'sm',
});

const sizeClasses = computed(() =>
    props.size === 'md'
        ? 'text-[11px] px-2.5 py-1'
        : 'text-[10px]',
);

const iconClasses = computed(() =>
    props.size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3',
);
</script>

<style scoped>
@keyframes boost-pulse {
    0%, 100% { box-shadow: 0 4px 6px -1px rgb(251 191 36 / 0.35); }
    50% { box-shadow: 0 4px 14px -1px rgb(251 191 36 / 0.55); }
}

.boost-badge-pulse {
    animation: boost-pulse 2.5s ease-in-out infinite;
}
</style>
