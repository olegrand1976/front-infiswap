<template>
    <div class="relative pt-6 lg:py-30">  
        <div class="absolute lg:hidden z-[1] bottom-0 left-0 h-96 sm:h-104 md:h-128 lg:h-full overflow-hidden pointer-events-none">
            <div class="bg-primary w-[100vw] h-full" style="
                clip-path: polygon(0 0, 0 100%, 100% 100%);
            "></div>
        </div>

        <div class="absolute hidden lg:inline z-[1] bottom-0 right-0 h-96 sm:h-104 md:h-128 lg:h-full overflow-hidden pointer-events-none">
            <div class="w-40 bg-primary w-[70vw] h-full" style="
                clip-path: polygon(100% 0, 100% 100%, 0 100%);
            "></div>
        </div>

        <div class="container relative z-10 flex-col-reverse max-w-5xl lg:flex-row flex items-center justify-between">
            <div class="relative z-10 w-full">
                <div class="relative inline-block">
                    <LayoutsAppImage
                        src="Group_1048.png"
                        alt="App Download"
                        class="sm:w-80 w-72 mt-24 sm:mt-0 mb-8 sm:mb-16"
                    />
                </div>
            </div>
            <div class="flex flex-col items-center relative z-10 w-full h-full">
                <div class="sm:-mt-28 flex flex-col items-center mx-auto">
                    <h2 class="lg:text-4xl text-3xl text-center sm:text-start font-bold text-primary">
                        Télécharger
                    </h2>
                    <p class="sm:text-2xl text-xl text-center sm:text-start text-primary font-extralight mt-3">
                        InfiSwap sur
                    </p>
                </div>
                <div class="bg-white p-8 shadow-md border border-slate-100 rounded-lg mt-8 space-y-7 relative z-10">
                    <div class="absolute -left-4 lg:-left-18 top-1/2 -translate-y-1/2 -translate-x-full lg:-top-40 z-20">
                        <LayoutsAppImage
                            src="/icons/Unin.png"
                            class="size-16 lg:size-26"
                        />
                    </div>
                    <div class="relative">
                        <div class="absolute flex items-center gap-2 left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-2 text-white bg-primary rounded-lg animate-bounce-fade duration-&lsqb;5s&rsqb; z-20">
                            <ClockIcon class="size-5" /> <span>Bientôt disponible</span>
                        </div>
                    </div>
                    <Button
                        variant="dark"
                        class="w-full flex flex-row h-20 shadow hover:shadow-lg items-center space-x-1 transition transform duration-300 ease-in-out cursor-not-allowed"
                    >
                        <LayoutsAppImage
                            src="/icons/playstore.png"
                            class="sm:w-12 sm:h-12 w-7 h-7"
                        />
                        <p class="sm:text-sm text-base font-bold text-start">
                            TÉLÉCHARGER<br>
                            <span class="sm:text-3xl text-xl">Google Play</span>
                        </p>
                    </Button>
                    <Button
                        variant="dark"
                        class="w-full flex flex-row h-20 shadow hover:shadow-lg items-center space-x-1 transition transform duration-300 ease-in-out cursor-not-allowed"
                    >
                        <LayoutsAppImage
                            src="/icons/apple.png"
                            class="sm:w-12 sm:h-12 w-7 h-7"
                        />
                        <p class="sm:text-sm text-base font-bold text-start">
                            Télécharger sur <br>
                            <span class="sm:text-3xl text-xl">Apple Store</span>
                        </p>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ClockIcon } from '@heroicons/vue/24/solid';
</script>
