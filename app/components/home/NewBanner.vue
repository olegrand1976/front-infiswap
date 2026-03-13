<template>
    <div
        class="relative w-full overflow-visible"
        style="min-height: 260px;"
    >
        <div
            class="absolute inset-0 z-0"
            style="background: linear-gradient(to bottom left, #4caf7d 0%, #7bc67e 35%, #e8304a 65%, #e8304a 100%);"
        />

        <div
            class="relative lg:hidden overflow-hidden"
            style="min-height: 320px;"
        >
            <div
                class="relative z-10 px-5 pt-7"
                style="max-width: 62%; margin-top: 30px;"
            >
                <LayoutsAppImage
                    src="/logo_white.png"
                    alt="Logo InfiSwap"
                    class="w-44 object-contain drop-shadow-xl mb-3"
                />
                <p
                    class="text-white font-light leading-relaxed"
                    style="font-size: 15px;"
                >
                    InfiSwap est la première plateforme belge 100% automatisée dédiée à la mise en relation des infirmiers.
                </p>
            </div>

            <div
                class="absolute bottom-0 right-0 z-5"
                style="width: 52%;"
            >
                <LayoutsAppImage
                    src="/home/nurse_with_bag.png"
                    alt="Infirmière InfiSwap"
                    class="w-full object-cover object-top drop-shadow-2xl"
                    style=" height: 260px;"
                />
            </div>
        </div>

        <div
            class="relative z-10 container mx-auto px-6 lg:px-16 hidden lg:flex flex-row items-center justify-between w-full"
            style="min-height: 260px;"
        >
            <div class="flex flex-col max-w-xl py-4 lg:py-0">
                <div class="mb-4">
                    <LayoutsAppImage
                        src="/logo_white.png"
                        alt="Logo InfiSwap"
                        class="w-72 lg:w-96 xl:w-105 object-contain drop-shadow-2xl"
                    />
                </div>
                <p class="text-white text-xl lg:text-4xl font-light leading-snug">
                    InfiSwap est la première plateforme belge 100% automatisée dédiée à la mise en relation des infirmiers.
                </p>
            </div>

            <div
                class="relative flex items-end justify-center lg:w-1/2 self-end"
                style="margin-bottom: 0;"
            >
                <div
                    v-if="!nurseLoaded"
                    class="relative z-10 w-86 lg:w-80 xl:w-96 animate-pulse rounded-2xl bg-white/20 my-16"
                    style="aspect-ratio: 3/4;"
                />
                <LayoutsAppImage
                    src="/home/nurse_with_bag.png"
                    alt="Infirmière InfiSwap"
                    class="relative z-10 w-72 lg:w-80 xl:w-96 object-contain drop-shadow-2xl"
                    :class="nurseLoaded ? 'block' : 'hidden'"
                    style="margin-top: 40px;"
                    @load="nurseLoaded = true"
                />
                <div
                    class="absolute z-20"
                    style="bottom: -80px; left: 20px;"
                >
                    <LayoutsAppImage
                        src="/home/phone_banner.png"
                        alt="Application InfiSwap"
                        class="w-52 lg:w-64 xl:w-80 object-contain drop-shadow-xl"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const nurseLoaded = ref(false);
</script>
