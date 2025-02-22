<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <tr :class="cn('border-b data-[state=selected]:bg-muted', props.class)">
        <slot />
    </tr>
</template>
