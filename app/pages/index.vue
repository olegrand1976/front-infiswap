<template>
    <div class="relative mt-6 sm:mt-0">
        <div class="flex flex-col">
            <HomeNewBanner />
            <HomePlatformStats />
            <HomeCommunityStory />
            <div class="container mt-12">
                <HomePlatform />
            </div>
            <HomeInstitutionBanner />
        </div>
        <div>
            <HomeJoinBanner />
        </div>

        <div
            class="hidden lg:block lg:fixed lg:right-0 lg:z-30 lg:top-32 lg:w-64"
        >
            <a
                href="tel:+32478023377"
                class="block rounded-l-md text-center shadow-lg bg-gray-50 p-2 transition-transform duration-500 ease-in-out"
            >
                <h5 class="mb-2 text-sm font-bold">
                    Contactez-nous au
                </h5>
                <p class="mt-1 text-xl font-bold text-success">
                    (+32) 478 02 33 77
                </p>
                <div class="absolute p-1 rounded-lg bg-success -top-2 -left-2 animate-pulse">
                    <Phone class="w-4 text-white" />
                </div>
            </a>
        </div>

        <NuxtLink
            v-if="!isLoggedIn"
            to="/register"
            class="lg:hidden fixed bottom-20 right-0 z-40 bg-primary text-white rounded-l-full shadow-lg px-4 py-3 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <UserPlus class="w-5 h-5" />
            <span class="text-sm font-semibold">Inscription</span>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { Phone, UserPlus } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';

const { isLoggedIn } = useAuth();

useHead({
    title: 'Accueil',
    meta: [
        {
            name: 'description',
            content:
        'InfiSwap – la plateforme de référence du remplacement infirmier. InfiSwap connecte les infirmières et infirmiers indépendants de Belgique et de France pour organiser facilement leurs remplacements : planification des absences (vacances, formation, urgences), recherche de missions, profils vérifiés, messagerie sécurisée et alertes instantanées. Une solution pensée pour assurer la continuité des soins, simplifier l’administratif et développer votre activité. Rejoignez la communauté !',
        },
    ],
});
</script>
