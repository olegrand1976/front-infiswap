<template>
    <div class="hidden sm:block pt-24 relative">
        <NuxtImg 
            src="/banner.png"
            alt="Bannière"
            class="-ms-3 w-[95vw]"
        />

        <div class="absolute flex flex-col lg:top-[30%] top-[35%] right-[25%]">
            <h1 class="text-white text-xl md:text-4xl xl:text-7xl ">
                je cherche <br>
                <strong class="mt-2">un(e) infirmier(e)</strong>
            </h1>
            <Button
                variant="secondary"
                class="w-52 text-primary md:mt-12 sm:mt-8"
                href="/search-nurse"
            >
                Consulter
            </Button>
        </div>    
    </div>

    <div class="sm:hidden relative">
        <NuxtImg 
            src="/banner_mobile.png"
            alt="Bannière mobile"
        /> 
        <div class="absolute bottom-12 left-[5.5rem] flex flex-col justify-center items-center space-y-6">
            <h1 class="text-white text-center text-3xl">
                je cherche <br>
                <strong>un(e) infirmier(e)</strong>
            </h1>
            <Button
                variant="secondary"
                class="w-52 text-primary"
                href="/search-nurse"
            >
                Consulter
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
