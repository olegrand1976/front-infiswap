<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { PaginationNext, type PaginationNextProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import {
    Button,
} from '@/components/ui/button';

const props = withDefaults(defineProps<PaginationNextProps & { class?: HTMLAttributes['class'] }>(), {
    asChild: true,
});

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
});
</script>

<template>
    <PaginationNext
        v-bind="delegatedProps"
        class="group"
    >
        <Button
            :class="cn('', props.class)"
            variant="outline"
        >
            <slot>
                <ChevronRight class="text-primary group-hover:text-white" />
            </slot>
        </Button>
    </PaginationNext>
</template>
