<template>
    <section class="relative w-full bg-primary overflow-hidden">
        <div class="lg:hidden">
            <div class="px-6 pt-10 pb-6 text-center">
                <h2 class="text-2xl font-light text-white leading-snug tracking-tight whitespace-pre-line">
                    {{ $t('home.institution.titleMobile') }}
                </h2>
            </div>

            <div class="flex flex-col items-center gap-3 px-8 pb-8">
                <Button
                    :href="localePath('/offre-institution')"
                    class="bg-white text-primary font-bold px-6 py-6 rounded-full w-full text-sm leading-tight hover:bg-white hover:scale-105 transition-transform duration-300 shadow-md whitespace-pre-line"
                >
                    {{ $t('home.institution.ctaStaff') }}
                </Button>
                <Button
                    :href="localePath('/offre-institution')"
                    class="bg-transparent border-2 border-white text-white font-bold rounded-full px-6 py-6 w-full text-sm leading-tight hover:scale-105 transition-transform duration-300 whitespace-pre-line"
                >
                    {{ $t('home.institution.ctaContinuity') }}
                </Button>
            </div>

            <div
                class="relative w-full"
                style="aspect-ratio: 4/3;"
            >
                <LayoutsAppImage
                    src="/home/nurse_with_elder.png"
                    :alt="$t('home.institution.alt')"
                    class="absolute inset-0 w-full h-full"
                    style="object-fit: cover; object-position: center 20%;"
                />
            </div>
        </div>

        <div class="hidden lg:block">
            <div class="max-w-4xl mx-auto pt-12 pb-6 px-6 text-center">
                <h2 class="text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight whitespace-pre-line">
                    {{ $t('home.institution.titleDesktop') }}
                </h2>
            </div>

            <div
                class="relative w-full"
                style="aspect-ratio: 16/9; max-height: 750px;"
            >
                <LayoutsAppImage
                    src="/home/nurse_with_elder.png"
                    :alt="$t('home.institution.alt')"
                    class="absolute inset-0 w-full h-full"
                    style="object-fit: cover; object-position: center 0%;"
                />

                <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 pb-16 z-10">
                    <Button
                        :href="localePath('/offre-institution')"
                        class="bg-white text-primary font-bold px-10 py-8 rounded-full min-w-100 hover:bg-white hover:scale-105 transition-transform duration-300 whitespace-pre-line"
                    >
                        {{ $t('home.institution.ctaStaff') }}
                    </Button>
                    <Button
                        :href="localePath('/offre-institution')"
                        class="bg-primary border-2 border-white text-white font-bold rounded-full px-10 py-8 min-w-100 hover:scale-105 transition-transform duration-300 whitespace-pre-line"
                    >
                        {{ $t('home.institution.ctaContinuity') }}
                    </Button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
