<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { type InputVariants, inputVariants } from './index';
import { cn } from '@/lib/utils';

const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    type?: 'text' | 'password';
    variant?: 'default' | 'transparent';
    size?: InputVariants['size'];
    placeholder?: string;
    class?: HTMLAttributes['class'];
    errors?: Record<string, string[]>;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});

const errorMessage = computed(() => props.errors?.[0] ?? '');
</script>

<template>
    <div class="relative">
        <input
            v-model="modelValue"
            :type="props.type || 'text'"
            :class="cn(inputVariants({ variant: props.variant, size: props.size }), props.class)"
            :placeholder="placeholder"
        >
        <p
            v-if="errorMessage"
            class="absolute text-red-500 text-[10px]"
        >
            {{ errorMessage }}
        </p>
    </div>
</template>
