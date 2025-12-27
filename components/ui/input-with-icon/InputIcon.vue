<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number | Date;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    label?: string;
    placeholder?: HTMLAttributes['placeholder'];
    type?: string;
    class?: HTMLAttributes['class'];
    icon?: Component;
    iconClass?: string;
    labelClass?: string;
    size?: 'sm' | 'md' | 'lg';
    errors?: string[];
    disabled?: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
    (e: 'blur', payload: FocusEvent): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});

const sizeClasses = computed(() => {
    const hasIcon = !!props.icon;

    const baseClasses = {
        sm: hasIcon ? 'h-8 text-sm pl-6 pr-2' : 'h-8 text-sm px-3',
        md: hasIcon ? 'h-10 text-base pl-10 pr-3' : 'h-10 text-base px-3',
        lg: hasIcon ? 'h-12 text-lg pl-10 pr-4' : 'h-12 text-lg px-4',
    };

    return baseClasses[props.size || 'md'];
});

const roundedClass = computed(() => {
    return {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }[props.rounded || 'full'];
});

const isFocused = ref(false);

const onFocus = () => {
    isFocused.value = true;
};

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<template>
    <div :class="cn('w-full', props.class)">
        <label
            v-if="label"
            :class="cn(
                'block text-sm transition-colors mb-2',
                isFocused ? 'text-primary' : 'text-gray-500',
                labelClass,
            )"
        >{{ label }}</label>

        <div class="relative w-full flex items-center">
            <input
                v-model="modelValue"
                :type="props.type === 'password' ? (isPasswordVisible ? 'text' : 'password') : props.type"
                :placeholder="placeholder"
                :disabled="props.disabled"
                :class="cn(
                    'flex h-10 w-full rounded-full border-2 border-gray-300 bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:text-sm focus-visible:border-spacing-0.5 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    sizeClasses[size || 'md'],
                    sizeClasses,
                    roundedClass,
                    { 'border-red-500': props.errors && props.errors.length > 0 },
                )"
                @focus="onFocus"
                @blur="$emit('blur', $event)"
            >
            <span
                v-if="icon"
                class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
            >
                <component
                    :is="icon"
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
        </div>

        <div
            v-if="props.errors && props.errors.length > 0"
            class="mt-1 ml-4"
        >
            <span class="text-xs text-red-500">
                {{ props.errors[0] }}
            </span>
        </div>
    </div>
</template>
