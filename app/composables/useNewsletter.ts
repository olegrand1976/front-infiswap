import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useNuxtApp } from '#app';

export function useNewsletter() {
    const email = ref('');
    const isLoading = ref(false);
    const { $apifetch } = useNuxtApp();

    const subscribeNewsletter = async () => {
        if (!email.value) {
            toast.error('Veuillez entrer un email valide.', { duration: 3000 });
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

            toast.success('Inscription réussie !', { duration: 3000 });

            email.value = ''; // Réinitialiser le champ après succès
        }
        catch (err) {
            toast.error('Échec de l\'inscription. Veuillez réessayer.', { duration: 3000 });
            console.error(err);
        }
        finally {
            isLoading.value = false;
        }
    };

    return { email, isLoading, subscribeNewsletter };
}
