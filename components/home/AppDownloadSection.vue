<template>
    <div class="relative pt-16 sm:pt-52 lg:pt-16 pb-2">
        <div class="flex lg:flex-row flex-col-reverse justify-center items-center relative z-20 mx-auto lg:space-x-24 xl:space-x-40">
            <div>
                <NuxtImg
                    src="/Group_1048.png"
                    alt="App Download"
                    class="sm:w-80 w-72 mt-24 sm:mt-0 mb-8 sm:mb-16"
                />
            </div>
            <div class="flex flex-col items-center mx-auto">
                <div class="sm:-mt-28 flex flex-col items-center mx-auto">
                    <h2 class="lg:text-4xl text-3xl text-center sm:text-start font-bold text-primary">
                        Télécharger
                    </h2>
                    <p class="sm:text-2xl text-xl text-center sm:text-start text-primary font-extralight mt-3">
                        InfiSwap sur
                    </p>
                </div>
                <div class="bg-neutral-50 sm:shadow-lg shadow-xl border border-neutral-200 p-8 rounded-xl sm:mt-16 mt-8 lg:mb-0 mb-0 sm:mb-16 flex flex-col space-y-7">
                    <Button
                        variant="dark"
                        class="w-full flex flex-row h-20 shadow hover:shadow-lg items-center space-x-1 transition transform duration-300 ease-in-out"
                        href="/"
                    >
                        <NuxtImg
                            src="/icons/playstore.png"
                            class="sm:w-12 sm:h-12 w-7 h-7"
                        />
                        <p class="sm:text-sm text-base font-bold text-start">
                            GET IT ON <br>
                            <span class="sm:text-3xl text-xl">Google Play</span>
                        </p>
                    </Button>
                    <Button
                        variant="dark"
                        class="w-full flex flex-row h-20 shadow hover:shadow-lg items-center space-x-1 transition transform duration-300 ease-in-out"
                        href="/"
                    >
                        <NuxtImg
                            src="/icons/apple.png"
                            class="sm:w-12 sm:h-12 w-7 h-7"
                        />
                        <p class="sm:text-sm text-base font-bold text-start">
                            Download on the <br>
                            <span class="sm:text-3xl text-xl">Apple Store</span>
                        </p>
                    </Button>
                </div>
            </div>
        </div>

        <div class="hidden lg:block absolute z-5 top-0 right-0">
            <NuxtImg
                src="/Vector_2.png"
                alt="Vecteur"
                class="w-[41.5rem] relative"
            />
        </div>

        <div class="lg:hidden absolute z-5 bottom-0 left-0">
            <NuxtImg
                src="/triangle_left.png"
                alt="Vecteur"
                class="w-80 h-96 sm:w-96 sm:h-[26rem] md:w-[28rem] md:h-[32rem] relative"
            />
        </div>

        <div class="absolute top-20 sm:top-24 sm:left-36 xl:top-16 left-6 xl:left-[40rem] lg:left-[33rem]">
            <NuxtImg
                src="/icons/Unin.png"
                class="xl:w-32 xl:h-32 lg:w-24 lg:h-24 sm:w-16 sm:h-16 w-10 h-10"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
