<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <th :class="cn('h-10 w-[13rem] flex justify-start px-4 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', props.class)">
        <slot />
    </th>
</template>
