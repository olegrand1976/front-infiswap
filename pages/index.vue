<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
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
useHead({
    title: 'Accueil',
    meta: [{ name: 'description', content: 'Page d\'accueil....' }],
});
</script>
