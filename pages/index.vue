<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <div class="container flex flex-col items-start w-full gap-4 mt-4 lg:mt-0">
            <div class="flex items-center justify-between w-full">
                <h1 class="py-3 text-primary sm:bg-gray-100 sm:w-[85%] sm:px-9 rounded-lg">
                    Remplacements <strong>les plus récentes</strong>
                </h1>
                <NuxtLink to="/dashboard/replacements/immediate">
                    <Button class="text-sm bg-primary">
                        Créer remplacement
                    </Button>
                </NuxtLink>
            </div>
            <ReplacementHome
                :get-data="getAccordingReplacements"
                class="w-full"
            />
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
        <!-- <section class="sm:-mt-16">
            <HomeSubscribeBanner
                bg-class="bg-white"
                title-class="text-white sm:text-primary"
                form-class="bg-primary"
                icon-class="text-white"
                input-class="text-white placeholder:text-white"
                button-class="text-primary"
                link-class="text-primary"
            />
        </section> -->
        <section>
            <HomeAppDownloadSection />
        </section>
    </div>
</template>

<script setup lang="ts">
import ReplacementHome from '~/components/ReplacementHome.vue';
import { useReplacements } from '~/composables/useReplacements';

const { getAccordingReplacements } = useReplacements();

useHead({
    title: 'Accueil',
    meta: [{ name: 'description', content: 'Page d\'accueil....' }],
});
</script>
