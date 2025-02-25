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
        <!-- <section class="container mx-auto lg:w-[90%] xl:w-[90%]">
            <HomeServiceContainer />
        </section> -->
        <section class="container mx-auto lg:px-8 xl:px-16">
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
