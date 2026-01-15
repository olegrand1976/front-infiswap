<template>
    <div class="rounded-xl overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
            <div class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-blue-200 hover:-translate-y-1 shadow-md">
                <div class="shrink-0">
                    <LayoutsNursTech class="w-40 text-blue-600 opacity-90" />
                </div>
                <div class="text-center md:text-left h-full flex flex-col justify-between gap-2">
                    <p class="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                        Boostez votre présence digitale avec notre offre
                        <NuxtLink
                            to="/nurstech-by-infiswap"
                            title="Voir le site"
                        >
                            <span class="relative align-baseline text-primarytech font-semibold hover:underline pr-2">
                                NursTech
                                <GlobeAltIcon class="absolute -top-0.5 -right-1 w-3 h-3" />
                            </span>
                        </NuxtLink>
                        <span class="ml-2">et une page dédiée à votre activité professionnelle.</span>
                    </p>

                    <div class="flex flex-wrap justify-center md:justify-start gap-2">
                        <NuxtLink
                            to="/nurstech-by-infiswap"
                            title="Voir le site"
                            class="px-4 py-1.5 border border-primarytech text-primarytech rounded-md text-sm font-medium transition duration-200 hover:bg-primarytech hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytech"
                            @click="handleProductClick('NursTech')"
                        >
                            Découvrir →
                        </NuxtLink>

                        <button
                            class="px-4 py-1.5 border border-primarytech text-primarytech rounded-md text-sm font-medium transition duration-200 hover:bg-primarytech hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytech"
                            @click="showNursTech = true"
                        >
                            Nous contacter →
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-cyan-200 hover:-translate-y-1 shadow-md">
                <div class="shrink-0">
                    <LayoutsNursAssur class="w-40 text-indigo-600 opacity-90" />
                </div>
                <div class="text-center md:text-left h-full flex flex-col justify-between gap-2">
                    <p class="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                        Bénéficiez d'un conseil personnalisé avec notre service d'assurances
                        <NuxtLink
                            to="/nursassur-by-infiswap"
                            title="Voir le site"
                        >
                            <span class="relative align-baseline text-primaryassur font-semibold hover:underline">
                                NursAssur
                                <GlobeAltIcon class="absolute -top-0.5 -right-3 w-3 h-3" />
                            </span>
                        </NuxtLink>
                        <span class="pl-3">dédié aux professionnels de santé.</span>
                    </p>

                    <div class="flex flex-wrap justify-center md:justify-start gap-2">
                        <NuxtLink
                            to="/nursassur-by-infiswap"
                            title="Voir le site"
                            class="px-4 py-1.5 border border-primaryassur text-primaryassur rounded-md text-sm font-medium transition duration-200 hover:bg-primaryassur hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryassur"
                            @click="handleProductClick('NursAssur')"
                        >
                            Découvrir →
                        </NuxtLink>

                        <button
                            class="px-4 py-1.5 border border-primaryassur text-primaryassur rounded-md text-sm font-medium transition duration-200 hover:bg-primaryassur hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryassur"
                            @click="showNursAssur = true"
                        >
                            Nous contacter →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:open="showNursTech">
        <DialogContent>
            <NurstechForm @close="showNursTech = false" />
        </DialogContent>
    </Dialog>

    <Dialog v-model:open="showNursAssur">
        <DialogContent>
            <NursassurForm @close="showNursAssur = false" />
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    GlobeAltIcon,
} from '@heroicons/vue/24/outline';

const showNursTech = ref(false);
const showNursAssur = ref(false);

const { productClick } = useProduct();

const handleProductClick = async (productName: string) => {
    try {
        await productClick({ product: productName });
        console.log(`Clic enregistré pour ${productName}`);
    }
    catch (error) {
        console.error('Erreur lors de l’enregistrement du clic', error);
    }
};
</script>
