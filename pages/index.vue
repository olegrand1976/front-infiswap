<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <div
            class="container flex flex-col items-start w-full gap-4 mt-4 lg:mt-0"
        >
            <div class="flex items-center justify-between w-full">
                <h3 class="xl:text-xl lg:text-xl md:text-xl sm:text-xl text-xl text-primary">
                    <span>Remplacements </span> <span class="font-bold">les plus récentes</span>
                </h3>
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
            <NuxtLink
                v-if="isAdmin"
                to="/dashboard/admin/replacements"
            >
                <Button class="text-sm bg-primary mb-4">
                    Voir plus
                </Button>
            </NuxtLink>
            <NuxtLink
                v-else
                to="/dashboard/replacements"
            >
                <Button class="text-sm bg-primary mb-4">
                    Voir plus
                </Button>
            </NuxtLink>
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
import { useAuth } from '~/composables/useAuth';

const { getAccordingReplacements } = useReplacements();
const { isAdmin } = useAuth();

useHead({
    title: 'Accueil',
    meta: [{ name: 'description', content: 'Page d\'accueil....' }],
});
</script>
