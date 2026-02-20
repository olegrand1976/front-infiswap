<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<SelectTriggerProps & {
    class?: HTMLAttributes['class'];
    position?: 'left' | 'right';
}>();

const delegatedProps = computed(() => {
    const { class: _, position: __, ...delegated } = props;

    return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectTrigger
        v-bind="forwardedProps"
        :class="cn(
            'flex h-10 l w-full items-center bg-transparent px-3 py-2 text-sm ring-offset-background data-placeholder:text-muted-foreground text-foreground/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-full [&>span]:truncate text-start border-2 border-gray-300',
            props.class,
        )"
    >
        <template v-if="props.position === 'left'">
            <SelectIcon as-child>
                <ChevronDownIcon class="w-5 h-5 text-primary font-bold opacity-50 shrink-0 sm:ms-0 ms-4" />
            </SelectIcon>
            <slot />
        </template>

        <template v-else>
            <div class="w-full flex items-center justify-between">
                <slot />
                <SelectIcon as-child>
                    <div class="w-full flex justify-end">
                        <ChevronDownIcon class="w-5 h-5 text-primary font-bold opacity-50 shrink-0 ms-6" />
                    </div>
                </SelectIcon>
            </div>
        </template>
    </SelectTrigger>
</template>
