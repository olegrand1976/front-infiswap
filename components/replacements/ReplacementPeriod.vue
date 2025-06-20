<template>
    <div :class="cn('relative', props.class)">
        <p>{{ period }}</p>
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

const period = `${formatToDMY(props.replacement.start_date)} - ${formatToDMY(props.replacement.end_date)}`;
</script>
