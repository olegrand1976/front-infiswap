<script setup lang="ts">
import { ChevronUpIcon } from '@heroicons/vue/24/outline';
import { SelectScrollUpButton, type SelectScrollUpButtonProps, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectScrollUpButton
        v-bind="forwardedProps"
        :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
    >
        <slot>
            <ChevronUpIcon class="h-4 w-4" />
        </slot>
    </SelectScrollUpButton>
</template>
