<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
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
            :class="cn('', props.class)"
            variant="outline"
        >
            <slot class="w-16 h-16">
                <ChevronLeft class="text-primary w-16 h-16 group-hover:text-white" />
            </slot>
        </Button>
    </PaginationPrev>
</template>
