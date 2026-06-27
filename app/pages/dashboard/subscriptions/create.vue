<template>
    <div
        class="relative min-h-96"
    >
        <div>
            <div class="flex flex-col justify-center items-center">
                <div class="flex flex-col items-center justify-center xl:mx-8 mb-8">
                    <h1 class="text-2xl font-medium text-success capitalize lg:text-3xl dark:text-white">
                        Accès InfiSwap
                    </h1>
                    <div class="mt-4">
                        <span class="inline-block w-28 h-1 bg-success rounded-full" />
                        <span class="inline-block w-6 h-1 mx-1 bg-success rounded-full" />
                        <span class="inline-block w-1 h-1 bg-success rounded-full" />
                    </div>
                </div>

                <Pricing />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'unsubscribed'],
});

useHead({
    title: 'Accès InfiSwap',
});
</script>
