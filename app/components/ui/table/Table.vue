<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

const expandsHorizontally = computed(() => {
    if (!props.class) {
        return false;
    }

    if (typeof props.class === 'string') {
        return props.class.includes('w-max');
    }

    if (Array.isArray(props.class)) {
        return props.class.some(value => typeof value === 'string' && value.includes('w-max'));
    }

    return false;
});
</script>

<template>
    <div
        :class="cn(
            'relative min-w-0',
            expandsHorizontally ? 'w-max min-w-full' : 'w-full max-w-full',
        )"
    >
        <table :class="cn('w-full caption-bottom text-sm', props.class)">
            <slot />
        </table>
    </div>
</template>
