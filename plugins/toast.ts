import { defineNuxtPlugin } from '#app';
import { useToast } from '@/components/ui/toast/use-toast';
import type { ToastProps } from '~/components/ui/toast';

export default defineNuxtPlugin((nuxtApp) => {
    const { toast } = useToast();

    const customToast = (options: ToastProps) => {
        toast({
            ...options,
            duration: 3000,
        });
    };

    nuxtApp.provide('toast', customToast);
});
