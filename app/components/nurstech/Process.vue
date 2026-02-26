<template>
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div
                v-for="(image, index) in nurseImages"
                :key="index"
                class="group relative bg-gray-100 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-primary h-full"
            >
                <div class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg">
                    {{ index + 1 }}
                </div>

                <div class="p-6 h-full flex flex-col">
                    <p class="text-center mb-4 text-primary group-hover:text-white text-xl font-medium">
                        {{ image.text }}
                    </p>

                    <div class="relative grow flex items-center justify-center">
                        <LayoutsAppImage
                            :src="image.src"
                            class="w-full h-auto max-h-80 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const nurseImages = [
    { src: '/home/standing_nurse.png', text: '1 Logo, 1 photo, une description de votre activité' },
    { src: '/home/satisfied_nurse.png', text: 'Nous créons votre page personnalisée sous 15 jours' },
    { src: '/home/victorious_nurse.png', text: 'Vous recevez plus de demandes et améliorez votre visibilité sur infiswap' },
];
</script>
