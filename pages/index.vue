<template>
    <div>
        <section>
            <HomeSearchNurseContainer />
        </section>
        <section>
            <HomeBanner />
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
            <HomeFormationContainer />
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
