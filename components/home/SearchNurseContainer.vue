<template>
    <div class="pt-32 relative hidden sm:block">
        <div class="flex justify-end items-center">
            <NuxtImg
                src="/Group_2968.png"
                class="w-[90%] z-10"
            />
        </div>
        <div class="absolute sm:top-36 sm:left-44 md:left-52 lg:top-40 xl:top-44 xl:left-96 left-64">
            <div class="relative z-20 flex xl:space-x-64 lg:space-x-48 md:space-x-32 sm:space-x-24 justify-center items-center">
                <div>
                    <h2 class="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-white">
                        je cherche <br>
                        <strong>Un(e) infirmier(e)</strong>
                    </h2>
                    <Button
                        variant="secondary"
                        class="text-primary lg:w-64 md:w-52 md:mt-12 sm:mt-8"
                        href="/search-nurse"
                    >
                        Consulter
                    </Button>
                </div>
                <div>
                    <NuxtImg
                        src="/home/Group_2050.png"
                        class="lg:w-52 md:w-44 sm:w-36"
                    />
                </div>
                <div class="absolute lg:-top-6 lg:right-48 md:-top-2 sm:-top-4 md:right-40">
                    <NuxtImg
                        src="/icons/Union_3.png"
                        class="xl:w-16 lg:w-10 md:w-12 sm:w-16"
                    />
                </div>
                <div class="absolute xl:-bottom-12 lg:-bottom-4 xl:right-28 md:-bottom-2 sm:-bottom-4 md:right-36">
                    <NuxtImg
                        src="/icons/cog.png"
                        class="xl:w-36 lg:w-28 sm:w-24"
                    />
                </div>
                <div class="absolute xl:-bottom-8 lg:-bottom-4 lg:right-72 md:right-64 sm:-bottom-2 sm:right-[14.5rem]">
                    <NuxtImg
                        src="/icons/Union.png"
                        class="xl:w-10 lg:w-7 md:w-6 sm:w-6"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="sm:hidden -mt-48 py-8 bg-primary flex flex-col">
        <div class="relative">
            <NuxtImg
                src="/home/Group_2050.png"
                class="w-48 mx-auto flex justify-center items-center"
            />
            <NuxtImg
                src="/icons/cog.png"
                class="w-20 absolute top-36 left-24"
            />
            <NuxtImg
                src="/icons/Union_3.png"
                class="w-12 absolute -top-6 left-20"
            />
            <NuxtImg
                src="/icons/Union.png"
                class="w-8 absolute top-24 right-20"
            />
        </div>

        <div class="flex flex-col mt-16 space-y-8 justify-center px-auto items-center">
            <h2 class="text-center text-2xl text-white">
                Je cherche <br>
                <strong>Un(e) infirmièr(e)</strong>
            </h2>
            <Button
                variant="secondary"
                href="/search-nurse"
                class="text-xs text-primary"
            >
                Consulter
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
