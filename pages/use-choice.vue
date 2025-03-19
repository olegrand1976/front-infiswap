<template>
    <div class="flex flex-col justify-between h-screen">
        <header class="bg-tertiary/30 h-20 flex justify-start items-center">
            <div class="container">
                <LayoutsLogo class="w-36" />
            </div>
        </header>

        <!-- <h1 class="text-3xl font-semibold text-primary underline mb-6">
            Confirmation - règlement d'utilisation de la plateforme
        </h1> -->
        <section class="container mx-auto px-6 py-16">
            <h2 class="text-3xl font-semibold text-primary text-center mb-8">
                Bienvenue sur notre plateforme !
            </h2>
            <p class="text-base text-gray-700 leading-relaxed text-center mb-8">
                Veuillez sélectionner l'option qui correspond à vos besoins afin d'accéder à votre espace personnalisé.
            </p>
            <!-- <p class="text-base text-gray-600 leading-relaxed text-center mb-10">
                Choisissez l'option qui correspond à vos besoins :
            </p> -->
            <ul class="list-disc pl-6 space-y-8 text-gray-700 mx-auto max-w-3xl">
                <li>
                    <span class="font-semibold text-xl text-primary">1 - Je cherche un remplacement</span>
                    <p class="text-sm text-gray-600 mt-2">
                        Vous êtes à la recherche d'un infirmier pour remplacer une mission temporaire ? Sélectionnez cette option pour consulter les remplaçants disponibles et gérer vos besoins en remplacement.
                    </p>
                </li>
                <li>
                    <span class="font-semibold text-xl text-primary">2 - Me faire remplacer</span>
                    <p class="text-sm text-gray-600 mt-2">
                        Vous êtes un infirmier et vous souhaitez vous faire remplacer temporairement ? Sélectionnez cette option pour consulter les missions disponibles et vous inscrire en tant que remplaçant.
                    </p>
                </li>
                <li>
                    <span class="font-semibold text-xl text-primary">3 - Les 2</span>
                    <p class="text-sm text-gray-600 mt-2">
                        Vous avez besoin d'accéder à la fois aux remplacements et à la possibilité de vous faire remplacer ? Sélectionnez cette option pour avoir accès aux deux fonctionnalités et gérer vos missions en toute flexibilité.
                    </p>
                </li>
            </ul>

            <h5 class="text-primary text-2xl font-semibold text-center mt-12 mb-6">
                Pour quelle utilisation de la plateforme ?
            </h5>

            <form
                class="mt-10 space-y-8"
                @submit.prevent="handleSubmit"
            >
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div
                        v-for="option in options"
                        :key="option.value"
                        :class="[
                            'h-16 flex justify-center items-center border-2 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105',
                            formData === option.value ? 'bg-primary text-white border-primary' : 'border-gray-300 text-primary hover:bg-primary hover:text-white',
                        ]"
                        @click="selectOption(option.value)"
                    >
                        <span class="text-lg font-medium">{{ option.label }}</span>
                    </div>
                </div>

                <div class="mt-8 w-full lg:w-80 mx-auto">
                    <Button
                        type="submit"
                        class="w-full py-6 px-6 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition duration-300 transform hover:scale-105"
                    >
                        Envoyer
                    </Button>
                </div>
            </form>
        </section>

        <footer>
            <div class="bg-primary text-white py-4 md:px-0 px-8">
                <p class="text-center text-[0.6em] md:text-xs">
                    <NuxtLink to="/legal-notice">Mentions légales</NuxtLink> -
                    <NuxtLink to="/privacy-security">Politique de Protection des données personnelles & Sécurité</NuxtLink> -
                    <NuxtLink to="/terms">CGU</NuxtLink>
                </p>
            </div>

            <div class="container py-4 w-full text-center bg-muted">
                <NuxtLink
                    to="https://www.ll-it-sc.be"
                    target="_blank"
                    class="text-center text-[0.6em] md:text-xs"
                >
                    @2025 LL-IT Software & Computer - Tous droits réservés
                </NuxtLink>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { $apifetch } = useNuxtApp();
const router = useRouter();

const options = [
    { label: 'Je cherche des remplacements', value: 'replace_me' },
    { label: 'Je souhaite me faire remplacer', value: 'search_remplacement' },
    { label: 'Faire les deux', value: 'all' },
];

const formData = ref(null);

const selectOption = (value) => {
    formData.value = formData.value === value ? null : value;
};

const handleSubmit = async (event) => {
    if (event?.preventDefault) {
        event.preventDefault();
    }

    if (!formData.value) {
        console.warn('Aucune option sélectionnée !');
        return;
    }

    try {
        const response = await $apifetch('/api/user-choice', {
            method: 'POST',
            body: { choice: formData.value },
        });

        console.log('Réponse API :', response);
        router.push('/privacy-security');
    }
    catch (error) {
        console.error('Erreur API :', error);
    }
};

useHead({
    title: 'Choix d\'utilisation',
});

definePageMeta({
    layout: 'auth',
});
</script>
