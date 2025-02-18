<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col-reverse sm:flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <section>
            <HomeReplaceMeContainer />
        </section>
        <section>
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
