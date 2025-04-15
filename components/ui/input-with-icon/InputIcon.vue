<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { cn } from '@/lib/utils';

const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    placeholder?: HTMLAttributes['placeholder'];
    type?: string;
    class?: HTMLAttributes['class'];
    icon?: Component;
    iconClass?: string;
    size?: 'sm' | 'md' | 'lg';
    errors?: string[];
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});

const sizeClasses = {
    sm: 'h-8 text-sm pl-6 pr-2',
    md: 'h-10 text-base pl-10 pr-3',
    lg: 'h-12 text-lg pl-10 pr-4',
};

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
    <div :class="cn('relative w-full items-center', props.class)">
        <input
            v-model="modelValue"
            :type="props.type === 'password' ? (isPasswordVisible ? 'text' : 'password') : props.type"
            :placeholder="placeholder"
            :class="cn(
                'flex h-10 w-full rounded-full border-2 border-gray-300 bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:text-sm focus-visible:border-spacing-0.5 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                sizeClasses[size || 'md'],
                props.class,
                { 'border-red-500': props.errors && props.errors.length > 0 },
            )"
        >
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <component
                :is="icon"
                v-if="icon"
                :class="cn('size-6', 'text-primary', props.iconClass)"
            />
        </span>
        <span
            v-if="props.type === 'password'"
            class="absolute end-2 inset-y-0 flex items-center cursor-pointer"
            @click="togglePasswordVisibility"
        >
            <EyeIcon
                v-if="!isPasswordVisible"
                class="h-5 w-5 text-gray-400"
            />
            <EyeSlashIcon
                v-if="isPasswordVisible"
                class="h-5 w-5 text-gray-400"
            />
        </span>
        <span
            v-if="props.errors && props.errors.length > 0"
            class="absolute start-6 -bottom-4"
        >
            <span class="text-xs text-red-500">
                {{ props.errors[0] }}
            </span>
        </span>
    </div>
</template>
