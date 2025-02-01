<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { type CardVariants, cardVariants } from '.';
import { cn } from '@/lib/utils';

const props = defineProps<{
    variant?: CardVariants['hover'];
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div
        :class="cn(cardVariants({ hover: props.variant }), props.class)"
    >
        <slot />
    </div>
</template>
