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
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
});
</script>

<template>
    <Primitive
        :as="href ? NuxtLink : as"
        :to="href"
        :class="cn(buttonVariants({ variant, size }), props.class)"
        v-bind="href ? {} : { type: 'button' }"
    >
        <slot />
    </Primitive>
</template>
