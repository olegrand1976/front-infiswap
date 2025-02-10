<template>
    <div class="h-screen flex flex-col text-center bg-white">
        <div class="container relative flex-1 z-10">
            <NuxtImg
                src="/logo.png"
                class="hidden h-12 lg:absolute top-10 z-20 left-1/2 transform -translate-x-1/2 lg:left-10 lg:translate-x-0"
            />
            <div class="flex justify-center items-end text-center h-full">
                <div class="-mb-8 lg:-mb-10 md:-mb-14">
                    <NuxtImg
                        src="/svg/not_found.svg"
                        class="h-72"
                    />
                </div>
            </div>
        </div>
        <div class="flex-1 bg-cover bg-center button-bg">
            <div class="flex gap-y-6 flex-col justify-center items-center h-full">
                <h1 class="container text-xl font-semibold md:text-4xl text-primary">
                    Page bientôt disponible
                </h1>
                <p class="text-xs md:text-sm">
                    La page que vous demandez est en cours de construction
                </p>
                <NuxtLink
                    to="/"
                    class="btn-pill text-white bg-primary hover:bg-primary/90 transition-base p-2 font-semibold w-[200px] md:w-[348px]"
                >
                    Revenir à l'accueil
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

  <style scoped>
    .button-bg {
      background-image: url('~/assets/images/Rectangle_53.png');
    }
  </style>
