<template>
    <div class="relative mt-12 lg:max-h-full">
        <NuxtImg
            src="/home/search_nurse_mobile.png"
            alt="Bannière rechercher une infirmière"
            class="w-full object-cover md:h-96 lg:hidden"
        />

        <NuxtImg
            src="/home/search_nurse_image.png"
            alt="Bannière rechercher une infirmière"
            class="hidden lg:inline-block -ml-20 w-full object-cover"
        />

        <div class="absolute top-1/2 w-full transform -translate-y-1/6 md:-translate-y-1/4 lg:-translate-y-1/2 text-white font-secondary italic">
            <div class="container mx-auto grid place-content-center text-center lg:text-left">
                <p class="text-3xl sm:text-5xl xl:text-6xl font-extralight">
                    Je cherche
                </p>
                <p class="mt-2 text-5xl md:text-7xl 3xl:text-12xl font-bold">
                    Un(e) infirmier(e)
                </p>

                <Button
                    variant="secondary"
                    href="/search-nurse"
                    class="mt-6 font-bold text-primary w-full max-w-32 mx-auto lg:mx-0"
                >
                    Consulter
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
