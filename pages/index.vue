<template>
    <div class="sm:mt-0 mt-16">
        <div class="flex flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <div>
            <HomeReplaceMeContainer />
            <HomeServiceContainer />
        </div>
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
