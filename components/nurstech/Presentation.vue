<template>
    <div class="rounded-xl overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
            <div class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-blue-200 hover:-translate-y-1 shadow-md">
                <div class="flex-shrink-0">
                    <LayoutsNursTech class="w-40 text-blue-600 opacity-90" />
                </div>
                <div class="text-center md:text-left">
                    <p class="text-gray-600 mb-4 leading-relaxed text-sm transition-colors duration-300 group-hover:text-gray-700">
                        Boostez votre présence digitale avec notre offre
                        <NuxtLink
                            to="/nurstech-by-infiswap"
                            title="Voir le site"
                        >
                            <span class="relative mr-2 align-baseline text-primarytech">
                                NursTech
                                <GlobeAltIcon class="absolute -top-1 -right-2.5 w-3 h-3" />
                            </span>
                        </NuxtLink>
                        et une page dédiée à votre activité sur Infiswap ainsi qu'un accès privilégié à notre base de données "nouveaux patients".
                    </p>
                    <button
                        class="px-5 py-1.5 border border-primarytech text-primarytech rounded-md font-medium text-sm transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-sm hover:border-blue-600 transform hover:-translate-y-0.5"
                        @click="showNursTech = true"
                    >
                        Découvrir →
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-cyan-200 hover:-translate-y-1 shadow-md">
                <div class="flex-shrink-0">
                    <LayoutsNursAssur class="w-40 text-indigo-600 opacity-90" />
                </div>
                <div class="text-center md:text-left">
                    <p class="text-gray-600 mb-4 leading-relaxed text-sm transition-colors duration-300 group-hover:text-gray-700">
                        Bénéficiez d'un conseil personnalisé avec notre service d'assurances NursAssur dédié aux professionnels de santé.
                    </p>
                    <button
                        class="px-5 py-1.5 border border-primaryassur text-primaryassur rounded-md font-medium text-sm transition-all duration-300 hover:bg-cyan-600 hover:text-white hover:shadow-sm hover:border-cyan-600 transform hover:-translate-y-0.5"
                        @click="showNursAssur = true"
                    >
                        En savoir plus →
                    </button>
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
</script>
