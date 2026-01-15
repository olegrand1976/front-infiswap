<template>
    <div
        class="container font-light grid grid-cols-6 gap-8 justify-between lg:mt-12"
    >
        <div class="relative col-span-6 lg:col-span-2 p-4 lg:p-8 grid place-content-center bg-rose-400 shadow-lg rounded-lg overflow-hidden">
            <div
                v-if="!user"
                class="text-white text-center"
            >
                <h2 class="text-lg lg:text-xl font-semibold">
                    🚀 InfiSwap est là ! 🩺
                </h2>
                <p>Une plateforme simple et rapide pour les infirmier(ère)s.</p>

                <div class="space-y-4 pt-6">
                    <div class="grid grid-cols-1 gap-4">
                        <Button
                            href="/dashboard/replacements/create"
                            class="w-full bg-white text-primary hover:bg-white/95 text-sm font-medium shadow-sm hover:shadow"
                        >
                            Me faire remplacer
                        </Button>

                        <p class="text-center">
                            ou
                        </p>

                        <Button
                            href="/dashboard/replacements"
                            class="w-full bg-white text-primary hover:bg-white/95 text-sm font-medium shadow-sm hover:shadow"
                        >
                            Je cherche un remplacement
                        </Button>
                    </div>

                    <p class="pt-4">
                        👉 Rejoignez-nous dès maintenant !
                    </p>

                    <div class="flex justify-center">
                        <NuxtLink
                            href="/register"
                            class="text-white underline underline-offset-2 text-sm font-medium shadow-sm"
                        >
                            Inscription
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="text-white text-center"
            >
                <div class="mb-2 lg:absolute right-4 top-4">
                    <BellAlertIcon class="size-8 mx-auto animate-ring" />
                </div>
                <p>
                    Pour une meilleure gestion de vos remplacements, commencez par encoder votre tournée sur infiswap
                </p>
                <div class="grid grid-cols-1 gap-4">
                    <Button
                        href="/dashboard/replacements/create"
                        class="mt-4 w-full bg-white text-primary hover:bg-white/95 text-sm font-medium shadow-sm hover:shadow"
                    >
                        Me faire remplacer
                    </Button>

                    <p>ou</p>

                    <Button
                        href="/dashboard/replacements"
                        class="w-full bg-white text-primary hover:bg-white/95 text-sm font-medium shadow-sm hover:shadow"
                    >
                        Je cherche un remplacement
                    </Button>
                </div>
                <p class="mt-4">
                    cela vous permettra de bénéficier de l'ensemble des fonctionnalités de la plateforme.
                </p>
            </div>
        </div>
        <div
            v-if="activeHomes?.length > 0"
            class="col-span-6 lg:col-span-3 w-full max-w-7xl mx-auto"
        >
            <div class="w-full overflow-x-hidden relative shadow-lg rounded-2xl">
                <Carousel>
                    <CarouselContent
                        ref="carouselContentRef"
                        class="flex gap-6 px-0 transition-transform duration-500 ease-in-out overflow-x-auto scroll-smooth snap-x snap-mandatory"
                    >
                        <CarouselItem
                            v-for="(home) in activeHomes"
                            :key="home.id"
                            class="carousel-item min-h-[400px] lg:min-h-[600px] w-full shrink-0 rounded-2xl overflow-hidden bg-white snap-start"
                        >
                            <LazyHomeMessageCard :home="home" />
                        </CarouselItem>
                    </CarouselContent>

                    <div
                        v-if="activeHomes.length > 1"
                        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                    >
                        <button
                            v-for="(home, index) in activeHomes"
                            :key="index"
                            class="h-2.5 w-2.5 rounded-full transition-colors"
                            :class="{
                                'bg-primary': index === currentSlide,
                                'bg-gray-300': index !== currentSlide,
                            }"
                            @click="scrollToSlide(index)"
                        />
                    </div>
                </Carousel>
            </div>
        </div>
        <div
            v-else
            class="col-span-6 lg:col-span-3 grid grid-cols-3 items-center shadow-lg rounded-lg overflow-hidden"
        >
            <div
                class="relative h-60 col-span-3 lg:col-span-1 lg:h-full w-full bg-red-200"
            >
                <LayoutsAppImage
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                <LayoutsAppImage
                    src="/home/mail-image.png"
                    class="absolute w-32 lg:w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div class="p-4 lg:p-8 col-span-3 lg:col-span-2 text-start lg:text-start">
                <p class="mb-4">
                    🩺 InfiSwap, c’est la 1ère plateforme belge 100% automatisée dédiée au remplacement entre infirmier(ère)s indépendant(e)s. Et chaque semaine, de nouveaux pros rejoignent la communauté ! 💪
                </p>
                <p class="mb-4">
                    Pensée avec et pour les professionnel(le)s de terrain, InfiSwap simplifie vos démarches : que vous cherchiez un remplacement, un complément d’activité ou une meilleure organisation de votre tournée, tout se fait en quelques clics, sans frais.
                </p>
                <p class="mb-4">
                    ✅ Zéro papier
                    ✅ Zéro perte de temps
                    ✅ Zéro commission
                    Juste un outil simple, fluide et efficace pour vous aider à travailler plus librement.
                </p>
                <p class="mb-4">
                    🚀 De nombreuses nouveautés sont encore à venir pour enrichir votre expérience. Rejoignez le mouvement, InfiSwap continue de grandir avec vous !
                </p>
            </div>
        </div>
        <div class="z-40 flex justify-center mt-6 lg:mt-0 lg:items-center lg:justify-center col-span-6 lg:col-span-1">
            <a
                href="/dashboard/replacements/immediate"
                class="transition-transform transform hover:scale-105"
            >
                <LayoutsAppImage
                    src="/home/help_me.png"
                    class="w-full max-w-xs h-48"
                />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BellAlertIcon } from '@heroicons/vue/24/solid';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

const { getSpecifiedHome } = useHome();
const activeHomes = ref([]);
const currentSlide = ref(0);
const carouselContentRef = ref(null);

const response = await getSpecifiedHome({
    params: {
        filter: 'active',
    },
});

activeHomes.value = response?.data || [];

function scrollToSlide(index: number) {
    currentSlide.value = index;
    const container = carouselContentRef.value?.$el || carouselContentRef.value;
    if (!container) return;

    const slides = container.querySelectorAll('.carousel-item');
    const targetSlide = slides[index];
    if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
}
const user = useUser();
</script>

<style>
@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(15deg); }
  3% { transform: rotate(-12deg); }
  5% { transform: rotate(10deg); }
  7% { transform: rotate(-8deg); }
  9% { transform: rotate(6deg); }
  11% { transform: rotate(-4deg); }
  13% { transform: rotate(2deg); }
  15% { transform: rotate(0); }
  100% { transform: rotate(0); }
}

.animate-ring {
  animation: ring 1.5s ease-in-out infinite;
  transform-origin: top center;
  display: inline-block;
}
</style>
