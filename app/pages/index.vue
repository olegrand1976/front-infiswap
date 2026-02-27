<template>
    <div class="relative mt-16 sm:mt-0">
        <div class="flex flex-col">
            <HomeBanner />
            <div class="container mt-12">
                <NurstechPresentation />
            </div>
            <HomeSearchNurseContainer />
        </div>
        <div
            v-if="replacements?.length > 0"
            class="container flex flex-col items-start w-full gap-4 mt-4 lg:mt-0"
        >
            <div class="flex items-center justify-between w-full text-primary">
                <h3 class="hidden text-xl md:block xl:text-xl lg:text-xl md:text-xl sm:text-xl">
                    <span>Découvrez les remplacements </span> <span class="font-bold">les plus récents</span>
                </h3>
                <h3 class="flex items-center gap-2 text-xl font-bold md:hidden">
                    <SparklesIcon class="size-5" /> Des remplacements
                </h3>
                <NuxtLink
                    to="/dashboard/replacements/immediate"
                    class="flex items-center"
                >
                    <Button class="hidden text-sm md:inline-block bg-primary">
                        <span>Créer remplacement</span>
                    </Button>
                    <PlusCircleIcon class="inline-block w-8 h-8 md:hidden text-primary" />
                </NuxtLink>
            </div>
            <div class="w-full">
                <ReplacementHome
                    :replacements="replacements"
                    :loading="loading"
                />
                <div class="flex justify-center w-full">
                    <NuxtLink
                        v-if="isAdmin"
                        to="/dashboard/admin/replacements"
                    >
                        <Button class="px-16 py-3 text-base bg-primary lg:mb-4">
                            Voir plus
                        </Button>
                    </NuxtLink>
                    <NuxtLink
                        v-else
                        to="/dashboard/replacements"
                    >
                        <Button class="px-16 py-3 text-base bg-primary lg:mb-4">
                            Voir plus
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div>
            <HomeReplaceMeContainer />
        </div>
        <section class="lg:container lg:mx-auto lg:px-32">
            <HomeServiceContainer />
        </section>
        <!-- <section class="container lg:mx-auto lg:px-32">
            <HomeCounterStat />
        </section> -->
        <!-- <section>
            <HomePlanningContainer />
        </section> -->
        <section>
            <HomeAppDownloadSection />
        </section>

        <div
            class="hidden lg:block fixed right-0 z-30 w-48 lg:top-32 lg:w-64"
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
                    <PhoneIcon class="w-4 text-white" />
                </div>
            </a>
        </div>

        <!-- Bouton flottant Inscription - Mobile uniquement -->
        <NuxtLink
            v-if="!isLoggedIn"
            to="/register"
            class="lg:hidden fixed bottom-20 right-0 z-40 bg-primary text-white rounded-l-full shadow-lg px-4 py-3 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <UserPlusIcon class="w-5 h-5" />
            <span class="text-sm font-semibold">Inscription</span>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { PlusCircleIcon, SparklesIcon, PhoneIcon, UserPlusIcon } from '@heroicons/vue/24/solid';
import ReplacementHome from '~/components/ReplacementHome.vue';
import { useReplacements } from '~/composables/useReplacements';
import { useAuth } from '~/composables/useAuth';
import type { Replacement } from '~/lib/types';
import { Button } from '@/components/ui/button';

const { isAdmin, isLoggedIn } = useAuth();
const { loading, getAccordingReplacements } = useReplacements();
const replacements = ref<Replacement[]>([]);

const data = await getAccordingReplacements();
replacements.value = (data ?? []) as Replacement[];

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
