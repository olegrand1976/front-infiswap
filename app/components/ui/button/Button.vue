<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Primitive, type PrimitiveProps } from 'radix-vue';
import { type ButtonVariants, buttonVariants } from '.';
import { cn } from '@/lib/utils';
import { NuxtLink } from '#components';

interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
    href?: string;
    inProgress?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
});

const isDisabled = computed(() => props.inProgress || props.disabled === true);
</script>

<template>
    <Primitive
        :as="href ? NuxtLink : as"
        :to="href"
        :class="cn(buttonVariants({ variant, size }), props.class)"
        v-bind="href ? {} : { type: 'button' }"
        :disabled="isDisabled"
        :aria-disabled="isDisabled"
    >
        <slot />
        <svg
            v-if="inProgress"
            class="animate-spin h-5 w-5 text-white absolute right-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 4V0a12 12 0 00-8.49 20.49L4 12z"
            />
        </svg>
    </Primitive>
</template>
