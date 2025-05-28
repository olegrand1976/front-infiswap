<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <div
            v-if="replacements"
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
        <section>
            <HomePlanningContainer />
        </section>
        <section>
            <HomeAppDownloadSection />
        </section>
    </div>
</template>

<script setup lang="ts">
import { PlusCircleIcon, SparklesIcon } from '@heroicons/vue/24/solid';
import ReplacementHome from '~/components/ReplacementHome.vue';
import { useReplacements } from '~/composables/useReplacements';
import { useAuth } from '~/composables/useAuth';

const { isAdmin } = useAuth();
const { loading, getAccordingReplacements } = useReplacements();
const replacements = ref([]);

onMounted(async () => {
    const data = await getAccordingReplacements();
    replacements.value = data;
});

useHead({
    title: 'Accueil',
    meta: [{ name: 'description', content: 'Page d\'accueil....' }],
});
</script>
