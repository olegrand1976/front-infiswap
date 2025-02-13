<template>
    <div>
        <div class="flex flex-col-reverse sm:flex-col">
            <HomeBanner />
            <HomeSearchNurseContainer />
        </div>
        <section class="lg:hidden">
            <HomeRegisterBetaContainer />
        </section>
        <section>
            <HomeGridCard />
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
