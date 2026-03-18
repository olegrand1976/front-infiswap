/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'vue-sonner';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const toastWrapper = (options: {
        title?: string;
        description?: string;
        variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
        status?: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
        action?: {
            label: string;
            onClick: () => void;
        };
    }) => {
        const { title, description, variant, status, duration, action } = options;

        const toastType = status || variant || 'default';

        const toastOptions: any = {
            duration: duration || 4000,
        };

        if (description) {
            toastOptions.description = description;
        }

        if (action) {
            toastOptions.action = {
                label: action.label,
                onClick: action.onClick,
            };
        }

        const toastTitle = title || '';

        switch (toastType) {
            case 'success':
                return toast.success(toastTitle, toastOptions);
            case 'error':
            case 'destructive':
                return toast.error(toastTitle, toastOptions);
            case 'warning':
                return toast.warning(toastTitle, toastOptions);
            case 'info':
                return toast.info(toastTitle, toastOptions);
            default:
                return toast.success(toastTitle, toastOptions);
        }
    };

    nuxtApp.provide('toast', toastWrapper);
});
