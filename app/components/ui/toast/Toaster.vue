<script setup lang="ts">
import { CircleCheck, XCircle } from 'lucide-vue-next';
import { useToast } from './use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '.';

const { toasts } = useToast();

const getIcon = (variant?: string) => (variant === 'destructive' ? XCircle : CircleCheck);
</script>

<template>
    <ToastProvider>
        <Toast
            v-for="toast in toasts"
            :key="toast.id"
            v-bind="toast"
        >
            <div class="grid gap-1">
                <ToastTitle v-if="toast.title">
                    {{ toast.title }}
                </ToastTitle>
                <template v-if="toast.description">
                    <ToastDescription v-if="isVNode(toast.description)">
                        <component :is="toast.description" />
                    </ToastDescription>
                    <ToastDescription
                        v-else
                        class="flex items-center gap-2"
                    >
                        <component
                            :is="getIcon(toast.variant)"
                            class="w-5 text-white"
                        />
                        {{ toast.description }}
                    </ToastDescription>
                </template>
                <ToastClose />
            </div>
            <component :is="toast.action" />
        </Toast>
        <ToastViewport />
    </ToastProvider>
</template>
