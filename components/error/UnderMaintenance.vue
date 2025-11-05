<template>
    <div class="flex flex-col text-center h-screen">
        <div class="container relative flex-1 z-10">
            <div class="flex justify-center items-end text-center h-full">
                <div class="-mb-28 md:-mb-14">
                    <div class="relative">
                        <LayoutsAppImage
                            src="under_construction.png"
                            class="h-72"
                        />
                        <LayoutsAppImage
                            src="/icons/cog.png"
                            class="w-52 absolute bottom-[5%] left-[115%]"
                        />
                        <LayoutsAppImage
                            src="/icons/cog.png"
                            class="w-20 absolute bottom-[55%] -left-[35%]"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 bg-cover bg-center button-bg">
            <div class="flex gap-y-6 flex-col justify-center items-center h-full">
                <h1 class="container text-xl font-semibold md:text-4xl text-primary">
                    Site en maintenance
                </h1>
                <p class="text-xs md:text-sm">
                    Le site est actuellement en maintenance. Nous vous remercions de votre compréhension et reviendrons très prochainement
                </p>
                
                <NuxtLink
                    to="/dashboard"
                    class="btn-pill text-white bg-primary hover:bg-primary/90 transition-base p-2 font-semibold w-[200px] md:w-[348px]"
                >
                    Retour à l'accueil
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.button-bg {
    background-image: url('/images/Rectangle_53.png');
}
</style>
