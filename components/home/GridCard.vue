<template>
    <div class="relative flex flex-col xl:space-y-32 lg:space-y-28 md:space-y-24 space-y-16 xl:-mt-12 lg:-mt-4 mg:pb-24 md:pb-20 pb-16 md:-mt-5 sm:-mt-4 -mt-2 z-40">
        <div class="hidden sm:block lg:container">
            <div class="flex flex-row xl:space-x-6 md:space-x-4 sm:space-x-2 lg:ps-auto md:ps-6 sm:ps-5">
                <Card
                    v-for="(card, index) in cards"
                    :key="index"
                    class="xl:w-[12rem] lg:w-[13rem] md:w-[10rem] sm:w-[9rem] flex flex-col rounded-lg xl:-mt-28 lg:-mt-16 md:-mt-12 sm:-mt-10"
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
                        <ChevronLeft class="w-5 h-5" />
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
                        <ChevronRight class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        <div class="container z-20 flex flex-col sm:flex-row justify-center items-center xl:space-x-36 lg:space-x-28 md:space-x-20 sm:space-x-12 sm:space-y-0 space-y-8 mx-auto">
            <div>
                <h3 class="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-3xl text-center sm:text-start text-primary font-bold">
                    Me faire remplacer
                </h3>
                <div class="flex flex-col md:space-y-4 sm:space-y-2 space-y-8 xl:mt-8 lg:mt-4 md:mt-4 mt-8 sm:mt-1">
                    <p class="xl:text-base lg:text-sm lg:w-96 md:text-xs sm:text-[0.75rem] sm:text-start text-center text-sm md:w-80 sm:w-72">
                        <strong>Besoin d'un remplacement ?</strong> Avec InfiSwap, publiez votre annonce en
                        quelques secondes et trouvez rapidement un infirmier disponible près de chez vous. <br>
                        Simplifiez la gestion de vos absences et assurez la continuité des soins en toute sérénité !
                    </p>
                    <p class="xl:text-base lg:text-sm lg:w-96 md:text-xs sm:text-[0.75rem] sm:text-start text-center text-sm md:w-80 sm:w-72">
                        Nos infirmiers sont aussi souvent sur les routes et se déplacent de patients en patients pendant
                        leurs tournées qui sont planifiées de semaine en semaine.
                    </p>
                </div>
                <Button
                    variant="outline"
                    class="flex justify-center items-center w-36 mx-auto sm:inline-block mt-6 sm:mx-0 md:mt-8 sm:mt-4 rounded-full lg:text-sm sm:text-xs"
                    href="/"
                >
                    En savoir plus
                </Button>
            </div>
            <div>
                <NuxtImg
                    src="/home/Des_infirmiers.jpg"
                    alt="Des infirmiers"
                    class="rounded-3xl xl:w-[35rem] xl:h-[36rem] lg:h-[29rem] lg:w-auto md:h-[20rem] sm:h-[16rem] h-96 object-cover object-center"
                />
            </div>
        </div>

        <div class="absolute sm:bottom-0 bottom-6 right-0">
            <NuxtImg
                src="/Vector_2.png"
                class="xl:h-[51rem] lg:h-[43rem] md:h-[31rem] sm:h-[23rem] h-96 relative z-10"
            />
        </div>
        <div class="hidden sm:block absolute lg:top-6 xl:right-24 lg:right-8 md:top-12 md:right-12 sm:top-20 sm:right-8">
            <NuxtImg
                src="/icons/Unin.png"
                class="relative -z-10 xl:w-auto xl:h-auto lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-12 sm:h-12"
            />
        </div>

        <div class="hidden lg:block absolute xl:top-36 xl:left-8 lg:top-48 lg:left-10 ">
            <NuxtImg
                src="/stetho.png"
                class="relative -z-10 xl:w-48 xl:h-52 lg:w-40 lg:h-44"
            />
        </div>

        <div class="absolute xl:bottom-40 lg:bottom-16 md:bottom-8 sm:bottom-6 sm:top-auto top-48 left-6">
            <NuxtImg
                src="/icons/Unin.png"
                class="relative -z-10 xl:w-16 xl:h-16 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-7 sm:h-7 w-8 h-8"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next';

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
        title: 'Cherche un remplacement',
        link: '/',
    },
    {
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
    },
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
