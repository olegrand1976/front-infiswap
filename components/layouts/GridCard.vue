<template>
    <div class="hidden sm:block sm:container">
        <div class="grid grid-cols-4 lg:gap-16 sm:gap-4">
            <Card
                v-for="(card, index) in cards"
                :key="index"
                class="w-full flex flex-col rounded-lg xl:-mt-28 lg:-mt-16 md:-mt-12 sm:-mt-10"
            >
                <CardHeader>
                    <NuxtImg
                        :src="card.image"
                        :alt="card.alt"
                        class="rounded-lg object-cover object-right md:h-36 sm:h-28 sm:w-full"
                    />
                </CardHeader>

                <CardContent class="mx-auto text-center lg:text-base md:text-sm sm:text-xs px-1 lg:h-44 md:h-36 sm:h-32">
                    <div>
                        <p class="group-hover:text-white">
                            {{ card.title }}
                        </p>
                        <Button
                            class="mt-6 group-hover:bg-white group-hover:text-primary lg:text-base md:text-sm sm:text-xs"
                            :href="card.link"
                        >
                            En savoir plus
                        </Button>
                    </div>
                    <div
                        class="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <span
                            v-for="dotIndex in 4"
                            :key="dotIndex"
                            class="w-2 h-2 rounded-full"
                            :class="dotIndex === index + 1 ? 'bg-primary' : 'bg-gray-800 bg-opacity-35'"
                            rounded-full
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>

    <div class="sm:hidden">
        <div>
            <div class="flex flex-row relative">
                <button
                    class="absolute top-1/3 left-2 transform -translate-y-1/2 bg-primary text-white rounded-full p-3 shadow-lg z-40"
                    :disabled="currentIndex === 0"
                    @click="prevCard"
                >
                    <ChevronLeftIcon class="w-5" />
                </button>

                <div class="w-full">
                    <div
                        class="flex transition-transform duration-300 ease-in-out ps-3"
                        :style="{ transform: `translateX(-${currentIndex * 10}rem)` }"
                    >
                        <div
                            v-for="(card, index) in cards"
                            :key="index"
                            class="w-full px-4"
                        >
                            <Card class="relative -mt-36 w-48 mx-auto rounded-xl">
                                <CardHeader>
                                    <NuxtImg
                                        :src="card.image"
                                        :alt="card.alt"
                                        class="w-full h-32 rounded-xl"
                                    />
                                </CardHeader>
                                <CardContent class="h-40">
                                    <div class="flex flex-col space-y-4 justify-center items-center text-center mx-auto">
                                        <p class="group-hover:text-white">
                                            {{ card.title }}
                                        </p>
                                        <Button
                                            class="group-hover:bg-white group-hover:text-primary"
                                            :href="card.link"
                                        >
                                            En savoir plus
                                        </Button>
                                    </div>
                                    <div
                                        class="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <span
                                            v-for="dotIndex in 4"
                                            :key="dotIndex"
                                            class="w-2 h-2 rounded-full"
                                            :class="dotIndex === index + 1 ? 'bg-primary' : 'bg-gray-800 bg-opacity-35'"
                                            rounded-full
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <button
                    class="absolute top-1/3 right-2 transform -translate-y-1/2 bg-primary text-white rounded-full p-3 shadow-lg z-40"
                    :disabled="currentIndex === cards.length - 1"
                    @click="nextCard"
                >
                    <ChevronRightIcon class="w-5" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/vue/24/solid';

import Card from '~/components/ui/card/Card.vue';
import CardContent from '~/components/ui/card/CardContent.vue';

const cards = [
    {
        image: '/home/Des_infirmiers.jpg',
        alt: 'Groupe d\'infirmiers',
        title: 'Me faire remplacer',
        link: '/',
    },
    {
        image: '/home/bon_infirmier.jpg',
        alt: 'Infirmier',
        title: 'Je cherche un remplacement',
        link: '/',
    },
/*  {
        image: '/home/Rectangle_24.png',
        alt: 'Infirmier',
        title: 'Mon planning',
        link: '/',
    },
    {
        image: '/home/formation_pic.jpeg',
        alt: 'Formation pic',
        title: 'Mes formations',
        link: '/',
    },  */
];

const currentIndex = ref(0);

const prevCard = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const nextCard = () => {
    if (currentIndex.value < cards.length - 1) {
        currentIndex.value++;
    }
};
</script>
