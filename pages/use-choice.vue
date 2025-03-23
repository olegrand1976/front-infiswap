<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p class="font-light">
                Pourquoi choisir notre site
            </p>
        </template>
        <section class="container mx-auto px-6 py-16">
            <h2 class="text-3xl font-semibold text-primary text-center mb-8">
                Bienvenue sur notre plateforme !
            </h2>
            <p class="text-base text-green-600 leading-relaxed text-center mb-10">
                Veuillez vérifier votre boîte de réception, un email vous a été envoyé.
            </p>
            <p class="text-base text-gray-700 leading-relaxed text-center mb-8">
                Veuillez sélectionner l'option qui correspond à vos besoins afin d'accéder à votre espace personnalisé.
            </p>
            <ul class="list-disc pl-6 space-y-8 text-gray-700 mx-auto max-w-3xl">
                <li>
                    <span class="font-semibold text-xl text-primary">1 - Je cherche un remplacement</span>
                    <p class="text-sm text-gray-600 mt-2">
                        Vous êtes à la recherche d'un infirmier pour remplacer une mission temporaire? Sélectionnez cette option pour consulter les remplaçants disponibles et gérer vos besoins en remplacement.
                    </p>
                </li>
                <li>
                    <span class="font-semibold text-xl text-primary">2 - Me faire remplacer</span>
                    <p class="text-sm text-gray-600 mt-2">
                        Vous êtes un infirmier et vous souhaitez vous faire remplacer temporairement? Sélectionnez cette option pour consulter les missions disponibles et vous inscrire en tant que remplaçant.
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
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                    <div
                        v-for="option in options"
                        :key="option.value"
                        :class="[
                            'h-20 w-60 flex justify-center items-center border-2 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105',
                            formData === option.value ? 'bg-primary text-white border-primary' : 'border-gray-300 text-primary hover:bg-primary hover:text-white',
                        ]"
                        @click="selectOption(option.value)"
                    >
                        <span class="text-lg font-medium text-center">{{ option.label }}</span>
                    </div>
                </div>

                <div class="mt-8 w-full lg:w-80 mx-auto">
                    <Button
                        type="submit"
                        class="w-full py-6 px-6 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition duration-300 transform hover:scale-105"
                    >
                        Envoyer
                    </Button>
                </div>
            </form>
        </section>
    </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';

const { $apifetch } = useNuxtApp();
const { $toast } = useNuxtApp();

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
        const data = {
            value: formData.value,
            key: 'choice',
        };

        const response = await $apifetch('/api/users/settings', {
            method: 'POST',
            body: data,
        });

        if (response === 200) {
            $toast({
                title: 'Succès',
            });
            setTimeout(() => {
                navigateTo('/legal-chart');
            }, 2000);
        }
        else {
            $toast({
                title: 'Succès',
            });
            setTimeout(() => {
                navigateTo('/dashboard');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }, 2000);
        }
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
