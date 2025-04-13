<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const { isAdmin } = useAuth();
const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <tr
        :class="cn('border-b transition-colors', {
            'hover:bg-gray-100 data-[state=selected]:bg-gray-100': isAdmin,
            'hover:bg-muted/50 data-[state=selected]:bg-bg-muted/50': !isAdmin,
        }, props.class)"
    >
        <slot />
    </tr>
</template>
