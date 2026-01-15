<template>
    <div :class="cn('relative', props.class)">
        <ReplacementsFormatPeriod :replacement="props.replacement" />
        <span
            v-show="isClosed(props.replacement)"
            class="absolute -top-5 -left-2 text-xs font-bold uppercase bg-primary text-white p-0.5"
        >Fermé</span>
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { Replacement } from '~/lib/types';

const { isClosed } = useReplacements();
const props = defineProps<{
    replacement: Replacement;
    class?: string;
}>();
</script>
