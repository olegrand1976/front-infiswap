<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { type InputVariants, inputVariants } from './index';
import { cn } from '@/lib/utils';

const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    variant?: 'default' | 'transparent';
    size?: InputVariants['size'];
    placeholder?: string;
    class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});
</script>

<template>
    <input
        v-model="modelValue"
        :class="cn(inputVariants({ variant: props.variant, size: props.size }), props.class)"
        :placeholder="placeholder"
    >
</template>
