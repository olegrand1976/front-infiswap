<template>
    <button
        v-if="clickable"
        type="button"
        class="inline-flex items-center gap-0.5"
        :class="[
            sizeClasses,
            plain
                ? 'p-0 bg-transparent border-0 shadow-none hover:opacity-80 focus:outline-none'
                : 'rounded-lg px-2 py-1.5 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
        ]"
        :title="title"
        :aria-label="title"
        @click.stop="emit('click')"
    >
        <Star
            v-for="i in count"
            :key="i"
            :class="[starSize, starColorClass]"
        />
    </button>
    <span
        v-else
        class="inline-flex items-center gap-0.5"
        :class="sizeClasses"
        :title="title"
        role="img"
        :aria-label="title"
    >
        <Star
            v-for="i in count"
            :key="i"
            :class="[starSize, starColorClass]"
        />
    </span>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
    count?: number;
    size?: 'sm' | 'md' | 'lg';
    clickable?: boolean;
    plain?: boolean;
    tone?: 'amber' | 'light';
    title?: string;
}>(), {
    count: 5,
    size: 'sm',
    clickable: false,
    plain: false,
    tone: 'amber',
    title: 'Remplacement boosté',
});

const emit = defineEmits<{ click: [] }>();

const sizeClasses = computed(() => ({
    sm: 'gap-0.5',
    md: 'gap-0.5',
    lg: 'gap-1',
}[props.size]));

const starSize = computed(() => ({
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
}[props.size]));

const starColorClass = computed(() =>
    props.tone === 'light' ? 'fill-white text-white' : 'fill-amber-400 text-amber-400',
);
</script>
