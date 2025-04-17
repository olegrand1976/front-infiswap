<template>
    <div class="max-w-5xl mx-auto py-10 px-4">
        <h1 class="text-2xl font-bold text-center text-primary mb-8">
            Calcul de Katz
        </h1>

        <div
            v-for="(item, index) in katzItems"
            :key="index"
            class="mb-4 border border-gray-200 rounded-xl shadow bg-white"
        >
            <button
                @click="toggle(index)"
                class="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:bg-blue-50"
            >
                <div class="flex items-center justify-center gap-3">
                    <component :is="item.icon" class="w-5 h-5" />
                    <span>{{ item.category }}</span>
                </div>
                <div class="text-base ml-auto mr-4">
                    {{ item.selected ?? 0 }}
                </div>
                <svg
                    :class="{ 'rotate-180': item.open }"
                    class="w-5 h-5 transform transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div v-if="item.open" class="px-6 pb-4 pt-2">
                <div class="grid grid-cols-2 gap-4">
                    <div
                        v-for="(choice, i) in item.choices"
                        :key="i"
                        class="col-span-1"
                    >
                        <p
                            @click="selectChoice(item, choice)"
                            :class="{
                                'bg-primary text-white': item.selected === choice.value,
                                'bg-gray-100 text-gray-800': item.selected !== choice.value,
                            }"
                            class="px-4 py-2 rounded-md cursor-pointer transition duration-300 text-center"
                        >
                            {{ choice.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-10 p-6 bg-white rounded-xl shadow border border-gray-200">
            <h3 class="text-lg font-semibold">
                Score Katz : {{ dynamicScore }}
            </h3>
            <Button
                class="mt-4 w-80 flex justify-center items-center mx-auto"
                type="submit"
                @click="handleSubmit"
            >
                Enregistrer
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
    BeakerIcon,
    BriefcaseIcon,
    ArrowsRightLeftIcon,
    ArrowDownIcon,
    ShieldCheckIcon,
    CakeIcon,
} from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';

const { $toast } = useNuxtApp();
const katzItems = ref([
    {
        category: 'Se laver',
        selected: 0,
        icon: BeakerIcon,
        choices: [
            { value: 1, label: '1. Capable de se laver complètement sans aide' },
            { value: 2, label: '2. Aide partielle pour le haut ou le bas' },
            { value: 3, label: '3. Aide partielle pour haut et bas' },
            { value: 4, label: '4. Totalement aidé pour le lavage' },
        ],
    },
    {
        category: 'S\'habiller',
        selected: 0,
        icon: BriefcaseIcon,
        choices: [
            { value: 1, label: '1. S\'habille seul sans aide' },
            { value: 2, label: '2. Aide pour mettre les vêtements' },
            { value: 3, label: '3. Besoin de supervision' },
            { value: 4, label: '4. Totalement dépendant' },
        ],
    },
    {
        category: 'Transfert et déplacement',
        selected: 0,
        icon: ArrowsRightLeftIcon,
        choices: [
            { value: 1, label: '1. Se lève/transfère seul' },
            { value: 2, label: '2. Aide légère pour transfert' },
            { value: 3, label: '3. Nécessite une aide importante' },
            { value: 4, label: '4. Totalement dépendant' },
        ],
    },
    {
        category: 'Aller à la toilette',
        selected: 0,
        icon: ArrowDownIcon,
        choices: [
            { value: 1, label: '1. Va aux toilettes seul' },
            { value: 2, label: '2. Aide pour se déplacer ou s\'essuyer' },
            { value: 3, label: '3. Besoin d\'aide complète' },
            { value: 4, label: '4. Utilise constamment des protections' },
        ],
    },
    {
        category: 'Continence',
        selected: 0,
        icon: ShieldCheckIcon,
        choices: [
            { value: 1, label: '1. Contrôle complet urines/selles' },
            { value: 2, label: '2. Pertes occasionnelles' },
            { value: 3, label: '3. Utilise des protections' },
            { value: 4, label: '4. Incontinence complète' },
        ],
    },
    {
        category: 'Manger',
        selected: 0,
        icon: CakeIcon,
        choices: [
            { value: 1, label: '1. Mange seul sans aide' },
            { value: 2, label: '2. Aide pour couper ou préparer' },
            { value: 3, label: '3. Nécessite surveillance pendant repas' },
            { value: 4, label: '4. Nourri entièrement par quelqu\'un' },
        ],
    },
]);

const dynamicScore = computed(() => {
    return katzItems.value
        .map(item => item.selected)
        .join(' ');
});

onMounted(() => {
    katzItems.value.forEach((item, index) => {
        item.open = index === 0;
    });
});

const toggle = (index) => {
    katzItems.value[index].open = !katzItems.value[index].open;

    if (index === 0 && katzItems.value[index].selected !== null) {
        katzItems.value[1].open = true;
    }
    if (index === 1 && katzItems.value[index].selected !== null) {
        katzItems.value[2].open = true;
    }
    if (index === 2 && katzItems.value[index].selected !== null) {
        katzItems.value[3].open = true;
    }
    if (index === 3 && katzItems.value[index].selected !== null) {
        katzItems.value[4].open = true;
    }
    if (index === 4 && katzItems.value[index].selected !== null) {
        katzItems.value[5].open = true;
    }
};

const selectChoice = (item, choice) => {
    item.selected = item.selected === choice.value ? 0 : choice.value;

    if (item === katzItems.value[0] && item.selected !== 0) {
        katzItems.value[1].open = true;
    }
    if (item === katzItems.value[1] && item.selected !== 0) {
        katzItems.value[2].open = true;
    }
    if (item === katzItems.value[2] && item.selected !== 0) {
        katzItems.value[3].open = true;
    }
    if (item === katzItems.value[3] && item.selected !== 0) {
        katzItems.value[4].open = true;
    }
    if (item === katzItems.value[4] && item.selected !== 0) {
        katzItems.value[5].open = true;
    }
};

const { $apifetch } = useNuxtApp();
const route = useRoute();
const patientId = route.params.id;

onMounted(() => {
    const katzCode = route.query.code;

    if (katzCode && katzCode.length === katzItems.value.length) {
        katzItems.value.forEach(item => {
            item.open = true;
        });

        katzCode.split('').forEach((val, index) => {
            katzItems.value[index].selected = parseInt(val);
        });
    }
});

async function handleSubmit() {
    if (!dynamicScore?.value) {
        console.log('Aucun score détecté.');
        return;
    }

    const cleanedScore = String(dynamicScore.value).replace(/\s+/g, '');
    const scoreArray = cleanedScore.split('');
    const isValid = scoreArray.length === 6 && !scoreArray.includes('0');

    if (isValid) {
        try {
            await $apifetch(`/api/patients/${patientId}/katz`, {
                method: 'PUT',
                body: {
                    katzCode: cleanedScore,
                },
            });

            $toast({
                description: 'Le score Katz a été mis à jour avec succès.',
            });

            setTimeout(() => {
                navigateTo(`/dashboard/patients/detail/${patientId}`);
            }, 2000);
        }
        catch (error) {
            $toast({
                description: 'Échec de la mise à jour du score Katz ', error,
                status: 'error',
                variant: 'destructive',
            });
        }
    }

    else {
        $toast({
            description: ' Le score est invalide ou incomplet.',
            status: 'error',
            variant: 'destructive',
        });
    }
}

useHead({
    title: 'Calcul de KATZ',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>

<style scoped>
p:not(.bg-primary):hover {
  background-color: #e2e8f0;
}
p {
  cursor: pointer;
}
.ml-auto {
  margin-left: auto;
}
</style>
