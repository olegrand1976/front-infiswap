import { useState, useNuxtApp, useRouter } from '#app';

export const sendContact = () => {
    const { $apifetch } = useNuxtApp();
    const router = useRouter();
    const { $toast } = useNuxtApp();

    const error = useState('contactError', () => null);
    const loading = useState('contactLoading', () => false);
    const success = useState('contactSuccess', () => false);

    const submitContact = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await $apifetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            if (response.success) {
                success.value = true;
            }

            $toast({
                description: response.message,
            });

            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
        catch (err) {
            error.value = err;
            $toast({
                description: 'L\'envoi de message a échoué',
                variant: 'destructive',
            });
        }
        finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        success,
        submitContact,
    };
};
