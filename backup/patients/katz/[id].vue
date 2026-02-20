<template>
    <div class="mx-auto py-10 px-4">
        <h1 class="text-2xl font-bold text-center text-primary mb-8">
            Calcul de Katz
        </h1>

        <div
            v-for="(item, index) in katzItems"
            :key="index"
            class="mb-4 border border-gray-200 rounded-xl shadow bg-white"
        >
            <button
                class="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:bg-blue-50"
                @click="toggle(index)"
            >
                <div class="flex items-center justify-center gap-3">
                    <component
                        :is="item.icon"
                        class="w-5 h-5"
                    />
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
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                v-if="item.open"
                class="px-6 pb-4 pt-2"
            >
                <div class="grid grid-cols-2 gap-4">
                    <div
                        v-for="(choice, i) in item.choices"
                        :key="i"
                        class="col-span-1"
                    >
                        <p
                            :class="{
                                'bg-primary text-white': item.selected === choice.value,
                                'bg-gray-100 text-gray-800': item.selected !== choice.value,
                            }"
                            class="px-4 py-2 rounded-md cursor-pointer transition duration-300 text-left flex items-center min-h-16"
                            @click="selectChoice(item, choice)"
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
            { value: 2, label: '2. Besoin d\'aide partielle pour se laver au-dessus ou en dessous de la ceinture' },
            { value: 3, label: '3. Besoin d\'aide partielle pour se laver au-dessus et en-dessous de la ceinture' },
            { value: 4, label: '4. Totalement aidé pour le lavage' },
        ],
    },
    {
        category: 'S\'habiller',
        selected: 0,
        icon: BriefcaseIcon,
        choices: [
            { value: 1, label: '1. S\'habille et se déshabille seul' },
            { value: 2, label: '2. Besoin d\'aide pour s\'habiller au-dessus ou en-dessous (sans les lacets)' },
            { value: 3, label: '3. Besoin d\'aide pour s\'habiller au-dessus et en-dessous' },
            { value: 4, label: '4. Doit être aidé pour s\'habiller partout' },
        ],
    },
    {
        category: 'Transfert et déplacement',
        selected: 0,
        icon: ArrowsRightLeftIcon,
        choices: [
            { value: 1, label: '1. Autonome pour le transfert et les déplacements, sans aide ni appareil' },
            { value: 2, label: '2. Autonome avec l’aide d’un auxiliaire (béquilles, fauteuil roulant, etc.)' },
            { value: 3, label: '3. Dépend d\'une aide pour au moins un transfert ou déplacement' },
            { value: 4, label: '4. Grabataire ou en fauteuil roulant, totalement dépendant pour se déplacer' },
        ],
    },
    {
        category: 'Aller à la toilette',
        selected: 0,
        icon: ArrowDownIcon,
        choices: [
            { value: 1, label: '1. Va seul aux toilettes, s\'habille ou s\'essuie' },
            { value: 2, label: '2. Besoin d\'aide pour un des trois : se déplacer, s\'habiller ou s\'essuyer' },
            { value: 3, label: '3. Besoin d\'aide pour deux des trois : se déplacer, s\'habiller ou s\'essuyer' },
            { value: 4, label: '4. Besoin d\'aide pour les trois : se déplacer, s\'habiller et s\'essuyer.' },
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
            { value: 1, label: '1. Peut manger et boire seul' },
            { value: 2, label: '2. Besoin d\'aide avant de manger ou boire' },
            { value: 3, label: '3. Besoin d\'aide partielle pour manger ou boire' },
            { value: 4, label: '4. Totalement dépendant pour manger et boire' },
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
        katzItems.value.forEach((item) => {
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
