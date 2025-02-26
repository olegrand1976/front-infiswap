<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <div>
            <HomeReplaceMeContainer />
        </div>
        <section class="lg:container l:mx-auto lg:px-8 xl:px-16 2xl:px-32">
            <HomeServiceContainer />
        </section>
        <section>
            <HomePlanningContainer />
        </section>
        <section>
            <HomeSubscribeBanner />
        </section>
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
