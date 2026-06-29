<template>
    <span
        class="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-50 font-semibold uppercase tracking-wide text-amber-900"
        :class="compact ? 'px-1.5 py-0.5 text-[9px] gap-0.5' : 'px-2 py-0.5 text-[10px] gap-1'"
        role="img"
        aria-label="Remplacement boosté"
    >
        <Star
            class="fill-amber-400 text-amber-400 shrink-0"
            :class="compact ? 'w-2.5 h-2.5' : 'w-3 h-3'"
        />
        Boosté
    </span>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next';

withDefaults(defineProps<{
    compact?: boolean;
}>(), {
    compact: false,
});
</script>
