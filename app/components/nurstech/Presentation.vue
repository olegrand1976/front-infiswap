<template>
    <div
        v-if="showNursTechCard || showNursAssurCard"
        class="rounded-xl overflow-hidden"
    >
        <div
            class="grid grid-cols-1 gap-4 pb-2"
            :class="gridClass"
        >
            <div
                v-if="showNursTechCard"
                class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-blue-200 hover:-translate-y-1 shadow-md"
            >
                <div class="shrink-0">
                    <LayoutsNursTech class="w-40 text-blue-600 opacity-90" />
                </div>
                <div class="text-center md:text-left h-full flex flex-col justify-between gap-2">
                    <p class="text-gray-600 text-sm leading-relaxed">
                        Créez votre page pro — visible par vos futurs patients.
                    </p>

                    <div class="flex flex-wrap justify-center md:justify-start gap-2">
                        <NuxtLink
                            to="/nurstech-by-infiswap"
                            title="Créer ma page web"
                            class="px-4 py-1.5 border border-primarytech text-primarytech rounded-md text-sm font-medium transition duration-200 hover:bg-primarytech hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytech"
                            @click="onDiscover('nurstech')"
                        >
                            Créer ma page web
                        </NuxtLink>

                        <button
                            type="button"
                            class="px-4 py-1.5 border border-primarytech text-primarytech rounded-md text-sm font-medium transition duration-200 hover:bg-primarytech hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primarytech"
                            @click="onContact('nurstech')"
                        >
                            Voir les formules
                        </button>
                    </div>
                </div>
            </div>

            <div
                v-if="showNursAssurCard"
                class="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 transition-all duration-300 group hover:border-cyan-200 hover:-translate-y-1 shadow-md"
            >
                <div class="shrink-0">
                    <LayoutsNursAssur class="w-40 text-indigo-600 opacity-90" />
                </div>
                <div class="text-center md:text-left h-full flex flex-col justify-between gap-2">
                    <p class="text-gray-600 text-sm leading-relaxed">
                        RC pro + prévoyance adaptées aux infirmiers libéraux.
                    </p>

                    <div class="flex flex-wrap justify-center md:justify-start gap-2">
                        <NuxtLink
                            to="/nursassur-by-infiswap"
                            title="Obtenir mon devis"
                            class="px-4 py-1.5 border border-primaryassur text-primaryassur rounded-md text-sm font-medium transition duration-200 hover:bg-primaryassur hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryassur"
                            @click="onDiscover('nursassur')"
                        >
                            Obtenir mon devis gratuit
                        </NuxtLink>

                        <button
                            type="button"
                            class="px-4 py-1.5 border border-primaryassur text-primaryassur rounded-md text-sm font-medium transition duration-200 hover:bg-primaryassur hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryassur"
                            @click="onContact('nursassur')"
                        >
                            Parler à un conseiller
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
import type { PartnerProduct } from '~/utils/partnerServices';
import { isPartnerProductActive } from '~/utils/partnerServices';
import type { User } from '~/lib/types';

const user = useState<User | null>('user');
const showNursTech = ref(false);
const showNursAssur = ref(false);

const {
    trackPartnerImpression,
    trackPartnerCtaClick,
    registerPartnerClickFromProduct,
} = usePartnerServices();

const showNursTechCard = computed(() => !isPartnerProductActive(user.value?.site));
const showNursAssurCard = computed(() => !isPartnerProductActive(user.value?.insurance));

const gridClass = computed(() =>
    showNursTechCard.value && showNursAssurCard.value ? 'lg:grid-cols-2' : 'lg:grid-cols-1',
);

onMounted(() => {
    if (showNursTechCard.value) {
        trackPartnerImpression('nurstech', 'dashboard_presentation', 'dashboard');
    }
    if (showNursAssurCard.value) {
        trackPartnerImpression('nursassur', 'dashboard_presentation', 'dashboard');
    }
});

function onDiscover(product: PartnerProduct) {
    trackPartnerCtaClick(product, 'dashboard_presentation', 'discover', 'dashboard');
    registerPartnerClickFromProduct(product, 'dashboard', 'presentation_card');
}

function onContact(product: PartnerProduct) {
    trackPartnerCtaClick(product, 'dashboard_presentation', 'contact', 'dashboard');
    registerPartnerClickFromProduct(product, 'dashboard', 'presentation_contact');
    if (product === 'nurstech') {
        showNursTech.value = true;
    }
    else {
        showNursAssur.value = true;
    }
}
</script>
