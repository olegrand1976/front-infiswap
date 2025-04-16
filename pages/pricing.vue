<template>
    <!-- <NuxtLayout name="guest-with-title">
        <template #title>
            <div class="flex flex-col items-center justify-center xl:mx-8 mb-8">
                <h1 class="text-2xl font-medium capitalize lg:text-3xl dark:text-white">
                    Abonnement
                </h1>
                <div class="mt-2">
                    <span class="inline-block w-28 h-1 bg-primary rounded-full" />
                    <span class="inline-block w-6 h-1 mx-1 bg-primary rounded-full" />
                    <span class="inline-block w-1 h-1 bg-primary rounded-full" />
                </div>
            </div>
        </template>
        <div
            class="relative min-h-96 container"
        >
            <Pricing />
        </div>
    </NuxtLayout> -->
    <section class="bg-white grid place-content-center">
        <TemporaryFree />
    </section>
</template>

<script setup lang="ts">
useHead({
    title: 'Abonnements',
});

definePageMeta({
    // layout: false,
});
</script>

<style scoped>
.bg-url {
  background-image: url('/images/home/equipe_infirmier.png');
}
</style>
