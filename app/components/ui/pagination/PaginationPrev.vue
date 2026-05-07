<script setup lang="ts">
import { ChevronLeft, Star } from 'lucide-vue-next';

import { PaginationPrev, type PaginationPrevProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import {
    Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationPrevProps & { class?: HTMLAttributes['class'] }>(), {
    asChild: true,
});

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
});
</script>

<template>
    <PaginationPrev
        v-bind="delegatedProps"
        class="group"
    >
        <Button
            :class="cn('w-9 h-9 rounded-full hover:bg-primary hover:text-white transition-colors duration-150', props.class)"
            variant="outline"
        >
            <slot>
                <ChevronLeft class="text-primary group-hover:text-white" />
            </slot>
        </Button>
    </PaginationPrev>
</template>
