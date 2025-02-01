<template>
    <div class="bg-tertiary/30 m-auto relative h-screen flex flex-col items-center">
        <div class="container m-auto xl:pt-0 sm:pt-16 flex flex-col space-y-10 justify-center items-center">
            <div>
                <LayoutsLogo class="md:w-[40rem] md:h-52 sm:w-[32rem] sm:h-36" />
            </div>

            <div class="flex flex-col justify-center items-center">
                <h1 class="text-center text-primary sm:text-2xl sm:mx-0 mx-5 text-lg font-semibold">
                    Plus le temps pour soigner, moins de temps à gérer !
                </h1>
                <p class="text-center xl:mx-80 lg:mx-52 mx-6 mt-5 sm:text-base text-sm">
                    InfiSwap est une plateforme dédiée aux infirmiers libéraux, facilitant les
                    remplacements, la gestion des tournées et le suivi des formations. Elle optimise la
                    planification, réduit le temps administratif et améliore la coordination, offrant ainsi
                    plus d'efficacité, de flexibilité et une meilleure qualité des soins.
                </p>
                <Button
                    class="font-bold sm:px-36 px-20 mt-8"
                    href="/auth/login"
                >
                    SUIVANT
                </Button>
            </div>
        </div>

        <div class="absolute bg-primary text-primary h-12 bottom-0 w-full">
            .
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Authentification',
});
</script>
