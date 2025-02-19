import { defineNuxtPlugin } from '#app';
import { useToast } from '@/components/ui/toast/use-toast';

export default defineNuxtPlugin((nuxtApp) => {
    const { toast } = useToast();

    const customToast = (options) => {
        toast({
            ...options,
            duration: 3000,
        });
    };

    nuxtApp.provide('toast', customToast);
});
