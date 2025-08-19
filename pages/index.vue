<template>
    <div class="sm:mt-0 mt-16 relative">
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
                <h3 class="hidden md:block xl:text-xl lg:text-xl md:text-xl sm:text-xl text-xl">
                    <span>Découvrez les remplacements </span> <span class="font-bold">les plus récents</span>
                </h3>
                <h3 class="md:hidden text-xl font-bold flex items-center gap-2">
                    <SparklesIcon class="size-5" /> Des remplacements
                </h3>
                <NuxtLink
                    to="/dashboard/replacements/immediate"
                    class="flex items-center"
                >
                    <Button class="hidden md:inline-block text-sm bg-primary">
                        <span>Créer remplacement</span>
                    </Button>
                    <PlusCircleIcon class="inline-block md:hidden w-8 h-8 text-primary" />
                </NuxtLink>
            </div>
            <div class="w-full">
                <ReplacementHome
                    :replacements="replacements"
                    :loading="loading"
                />
                <div class="w-full flex justify-center">
                    <NuxtLink
                        v-if="isAdmin"
                        to="/dashboard/admin/replacements"
                    >
                        <Button class="text-base bg-primary lg:mb-4 px-16 py-3">
                            Voir plus
                        </Button>
                    </NuxtLink>
                    <NuxtLink
                        v-else
                        to="/dashboard/replacements"
                    >
                        <Button class="text-base bg-primary lg:mb-4 px-16 py-3">
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
        <section class="container lg:mx-auto lg:px-32">
            <HomeCounterStat />
        </section>
        <section>
            <HomePlanningContainer />
        </section>
        <section>
            <HomeAppDownloadSection />
        </section>

        <div
            class="fixed bottom-16 sm:bottom-0 sm:top-32 right-0 w-48 sm:w-64 z-50"
        >
            <a
                href="tel:+32478023377"
                :class="[
                    'block rounded-l-md text-center shadow-lg bg-gray-50 p-2 transition-transform duration-500 ease-in-out',
                    showContact ? 'translate-x-0' : 'translate-x-[105%]',
                ]"
            >
                <h5 class="text-sm mb-2 font-bold">
                    Contactez-nous au
                </h5>
                <p class="mt-1 text-success text-xl font-bold">
                    (+32) 478.02.33.77
                </p>
                <div class="bg-success p-1 absolute -top-2 -left-2 animate-pulse rounded-lg">
                    <PhoneIcon class="w-4 text-white" />
                </div>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PlusCircleIcon, SparklesIcon, PhoneIcon } from '@heroicons/vue/24/solid';
import ReplacementHome from '~/components/ReplacementHome.vue';
import { useReplacements } from '~/composables/useReplacements';
import { useAuth } from '~/composables/useAuth';
import type { Replacement } from '~/lib/types';

const { isAdmin } = useAuth();
const { loading, getAccordingReplacements } = useReplacements();
const replacements = ref<Replacement[]>([]);

const showContact = ref(false);

setTimeout(() => {
    showContact.value = true;
}, 100);

const data = await getAccordingReplacements();
replacements.value = (data ?? []) as Replacement[];

useHead({
    title: 'Accueil',
    meta: [{ name: 'description', content: 'Page d\'accueil....' }],
});
</script>
