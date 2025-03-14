import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useToast } from '@/components/ui/toast/use-toast';

export function useNewsletter() {
    const email = ref('');
    const isLoading = ref(false);
    const { $apifetch } = useNuxtApp();
    const { toast } = useToast();

    const subscribeNewsletter = async () => {
        if (!email.value) {
            toast({
                title: 'Erreur',
                description: 'Veuillez entrer un email valide.',
                variant: 'destructive',
                duration: 3000,
            });
            return;
        }

        isLoading.value = true;

        try {
            const response = await $apifetch('api/newsletter/subscribe', {
                method: 'POST',
                body: { email: email.value },
            });

            if (!response || response.error) {
                throw new Error(response?.error || 'Erreur inconnue');
            }

            toast({
                title: 'Succès',
                description: 'Inscription réussie !',
                duration: 3000,
            });

            email.value = ''; // Réinitialiser le champ après succès
        }
        catch (err) {
            toast({
                title: 'Erreur',
                description: 'Échec de l\'inscription. Veuillez réessayer.',
                variant: 'destructive',
                duration: 3000,
            });
            console.error(err);
        }
        finally {
            isLoading.value = false;
        }
    };

    return { email, isLoading, subscribeNewsletter };
}
