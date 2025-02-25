<template>
    <div>
        <div class="flex flex-col-reverse sm:flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <section>
            <HomeReplaceMeContainer />
        </section>
        <!-- <section class="container">
            <HomeServiceContainer />
        </section> -->
        <section class="container lg:px-2 xl:px-28">
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
