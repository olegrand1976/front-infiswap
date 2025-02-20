<template>
    <div class="relative mt-12 lg:max-h-full">
        <NuxtImg
            src="/home/search_nurse_mobile.png"
            alt="Bannière rechercher une infirmière"
            class="lg:hidden w-full object-cover md:h-96 lg:h-auto"
        />

        <NuxtImg
            src="/home/search_nurse_image.png"
            alt="Bannière rechercher une infirmière"
            class="hidden lg:inline-block -ml-2 w-11/12 object-cover"
        />

        <div class="absolute lg:ml-4 font-secondary w-full italic text-white transform top-1/2 -translate-y-1/5 lg:-translate-y-1/2">
            <div class="w-full container grid place-content-center text-center lg:text-left lg:ml-20 2xl:ml-0">
                <p class="text-3xl sm:text-5xl lg:text-6xl font-extralight">
                    Je cherche
                </p>
                <p class="text-4xl lg:text-8xl 3xl:text-12xl font-bold mt-2">
                    Un(e) infirmier(e)
                </p>
                <Button
                    variant="secondary"
                    href="/search-nurse"
                    class="font-bold mt-4 mx-auto lg:ml-0 lg:mt-6 text-primary w-full max-w-32"
                >
                    Consulter
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
