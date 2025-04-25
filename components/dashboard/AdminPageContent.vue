<template>
    <div :class="cn('w-full rounded-md bg-white', customClass)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: string;
}>();

const customClass = computed(() => props.class);
</script>
