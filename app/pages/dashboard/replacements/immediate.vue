<template>
    <div class="lg:ml-20 xl:ml-0 space-y-6">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <ArrowLeftIcon
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-medium">
                Remplacement immédiat <strong>pour aujourd'hui</strong>
            </h1>
        </div>

        <Form @submit="submit">
            <div class="bg-gray-100 rounded-xl px-6 sm:px-8 md:px-10 py-8 mx-auto max-w-5xl w-full">
                <h3 class="text-center text-lg text-primary py-4 mb-2 font-bold">
                    Besoin d’aide rapidement ? Rien de plus simple !
                </h3>
                <div class="space-y-4">
                    <div class="flex flex-wrap gap-6 mt-4">
                        <div class="flex-1 min-w-[250px] grid grid-cols-[40%_60%] items-center">
                            <h5 class="text-sm text-gray-700 font-medium">
                                Heure début *
                            </h5>
                            <InputTime
                                v-model="formData.startTime"
                                input-class="rounded-full"
                            />
                        </div>

                        <div class="flex-1 min-w-[250px] grid grid-cols-[40%_60%] items-center">
                            <h5 class="text-sm text-gray-700 font-medium">
                                Heure fin *
                            </h5>
                            <InputTime
                                v-model="formData.endTime"
                                input-class="rounded-full"
                            />
                        </div>

                        <div class="flex-1 min-w-[250px] grid grid-cols-[40%_60%] items-center">
                            <h5 class="text-sm text-gray-700 font-medium">
                                Nombre de patients *
                            </h5>
                            <Input
                                v-model="formData.patientCount"
                                placeholder="10"
                                class="w-full text-sm text-gray-700 rounded-full border border-solid border-gray-400 focus:outline-none h-10 px-3"
                            />
                        </div>
                    </div>
                    <div class="block relative lg:hidden">
                        <div>
                            <h5 class="text-sm text-gray-700 font-medium leading-tight">
                                Codes postaux *
                            </h5>
                            <InputTagManager
                                v-model="formData.zipCodes"
                                :placeholder="user.profile.country == 'fr' ? '75000, 40990, 89550' : '6565,4561,1237'"
                                class="w-[102%] pt-4"
                                :is-mobile="true"
                                :comma-validation="false"
                                @keydown.enter.prevent
                                @item-added="onZipCodeAdded"
                            />
                        </div>

                        <Button
                            variant="none"
                            class="absolute -top-2 -right-2 font-bold text-primary text-xs mt-2"
                            @click="openProposalDialog('')"
                        >
                            Boost IA
                        </Button>

                        <div>
                            <h5 class="text-sm text-gray-700 font-medium leading-tight mt-4">
                                Villes *
                            </h5>
                            <InputTagManager
                                v-model="formData.cities"
                                :placeholder="user.profile.country ? 'Paris, Landes, Yonne' : 'Anvers, Bruges, Gand'"
                                class="w-[102%] pt-4"
                                :is-mobile="true"
                                :comma-validation="true"
                                :no-space-validation="true"
                                @keydown.enter.prevent
                                @item-added="onCityAdded"
                            />
                        </div>
                    </div>
                    <div class="hidden relative lg:grid lg:grid-cols-2 lg:gap-4">
                        <div class="flex items-start gap-2 h-full">
                            <h5 class="text-sm text-gray-700 font-medium whitespace-nowrap leading-tight w-1/4 pt-10">
                                Codes postaux *
                            </h5>
                            <div class="w-3/4">
                                <InputTagManager
                                    v-model="formData.zipCodes"
                                    placeholder="6565,4561,1237"
                                    class="w-full pt-6"
                                    :is-mobile="false"
                                    :comma-validation="false"
                                    @keydown.enter.prevent
                                    @item-added="onZipCodeAdded"
                                    @open-proposal="openProposalDialog"
                                />
                            </div>
                        </div>

                        <div class="flex items-start gap-2 h-full ml-4">
                            <h5 class="text-sm text-gray-700 font-medium whitespace-nowrap leading-tight w-1/4 pt-10">
                                Villes *
                            </h5>
                            <div class="w-3/4">
                                <InputTagManager
                                    v-model="formData.cities"
                                    placeholder="Anvers, Bruges, Gand"
                                    class="w-full pt-6"
                                    :comma-validation="true"
                                    :no-space-validation="true"
                                    @keydown.enter.prevent
                                    @item-added="onCityAdded"
                                    @open-proposal="openProposalDialog"
                                />
                            </div>
                        </div>

                        <Button
                            variant="none"
                            class="absolute -top-2 right-0 font-bold text-primary text-xs mt-2"
                            @click="openProposalDialog('')"
                        >
                            Boost IA
                        </Button>

                        <ProposalLocationModal
                            v-model="proposalDialog"
                            v-model:newly-added-value="newlyAddedValue"
                            title="Suggestions"
                            description="Sélectionnez uniquement les codes postaux/villes que vous souhaitez conserver parmi ceux déjà cochés pour l'encodage de vos lieux cibles"
                            :initial-zip-codes="formData.zipCodes"
                            :initial-cities="formData.cities"
                            :is-preference-mode="false"
                            @update:initial-zip-codes="updateZipCodes"
                            @update:initial-cities="updateCities"
                        />
                    </div>

                    <div class="grid grid-cols-[30%_70%] items-center pt-4 lg:pt-8">
                        <h5 class="text-sm text-gray-700 font-medium">
                            Type de soin
                        </h5>
                        <Select
                            v-model="formData.careTypes"
                            multiple
                        >
                            <SelectTrigger
                                class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                position="right"
                            >
                                <SelectValue class="truncate w-800">
                                    <template v-if="getSelectedCareTypesText(formData.careTypes)">
                                        {{ getSelectedCareTypesText(formData.careTypes) }}
                                    </template>
                                    <template v-else>
                                        <span class="text-black/60">
                                            Sélectionner un type de soin
                                        </span>
                                    </template>
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                <SelectGroup class="w-32">
                                    <div
                                        v-for="careType in careTypes"
                                        :key="careType.id"
                                        class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        @click="handleCareTypeClick(formData, careType.id)"
                                    >
                                        <Checkbox
                                            :checked="formData.careTypes.includes(careType.id)"
                                            class="mr-2"
                                        />
                                        <label class="text-xs text-nowrap cursor-pointer">
                                            {{ careType.name }}
                                        </label>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div
                    v-if="hasMultipleValidRoles"
                    class="mt-8 sm:mt-12 grid sm:grid-cols-[30%_70%] gap-4 sm:gap-0 items-center"
                >
                    <label class="text-sm text-gray-700 font-medium">
                        Demander en tant que
                    </label>
                    <div class="flex gap-2 flex-col sm:flex-row sm:gap-8 2xl:gap-12 sm:items-center">
                        <div class="flex gap-2 items-center">
                            <input
                                id="nurse"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="nurse"
                            >
                            <label for="nurse">
                                Infirmier(ère)
                            </label>
                        </div>
                        <div class="flex gap-2 items-center">
                            <input
                                id="caregiver"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="caregiver"
                            >
                            <label for="caregiver">
                                Aide soignant(e)
                            </label>
                        </div>
                        <div class="flex gap-2 items-center">
                            <input
                                id="midwife"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="midwife"
                            >
                            <label for="midwife">
                                Sage-femme
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    class="my-12 w-80 flex justify-center items-center mx-auto"
                    type="submit"
                    :in-progress="inProgress"
                >
                    Enregistrer
                </Button>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { InputTime } from '@/components/ui/input-time';
import InputTagManager from '@/components/InputTagManager.vue';
import { LayoutsAppImage } from '#components';
import type { User } from '~/lib/types';
import { goBack } from '~/lib/utils';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const user = useState<User>('user');
const validRoles = ['nurse', 'caregiver', 'midwife'];
const selectedRole = ref(null);

const roleType = computed(() => {
    return user.value.roles.find(role => validRoles.includes(role));
});

const hasMultipleValidRoles = computed(() => {
    const userRoles = user.value.roles || [];
    const matchingRoles = userRoles.filter(role => validRoles.includes(role));
    return matchingRoles.length >= 2;
});

const { careTypes, fetchCareTypes } = useCareTypes();
const { $toast } = useNuxtApp();
const { sendUrgentReplacement } = useReplacements();
const { getCityFromZipCode, getZipCodeFromCity } = useOpenai();

onMounted(() => {
    if (hasMultipleValidRoles.value) {
        selectedRole.value = null;
        formData.roleType = null;
    }
    else {
        selectedRole.value = roleType.value;
        formData.roleType = roleType.value;
    }
});

await fetchCareTypes();

const formData = reactive({
    startTime: '',
    endTime: '',
    patientCount: '',
    roleType: roleType.value,
    zipCodes: [],
    cities: [],
    careTypes: [],
    zipCodesInput: '',
    citiesInput: '',
});

watch(selectedRole, (newVal) => {
    if (newVal) {
        formData.roleType = newVal;
    }
});

const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');

const updateZipCodes = (newZipCodes: string[]) => {
    formData.zipCodes = [...newZipCodes];
};

const updateCities = (newCities: string[]) => {
    formData.cities = [...newCities];
};

const openProposalDialog = (value: string) => {
    newlyAddedValue.value = value;
    proposalDialog.value = true;
};

// const onZipCodeAdded = async (zip: string) => {
//     const citiesFromZip = await getCityFromZipCode(zip);
//     if (!citiesFromZip) return;

//     const citiesSet = new Set(formData.cities);
//     citiesFromZip.forEach(city => citiesSet.add(city));
//     formData.cities = Array.from(citiesSet);
//     openProposalDialog(zip);
// };
const onZipCodeAdded = async (zip: string) => {
    const country = user.value.profile.country;

    // Validation longueur
    if (
        (country === 'be' && zip.length !== 4) ||
        (country === 'fr' && zip.length !== 5)
    ) {
        $toast({
            description: `Code postal invalide pour ce pays`,
        });

        // supprimer le dernier ajouté
        formData.zipCodes = formData.zipCodes.filter(z => z !== zip);
        return;
    }

    // Validation uniquement chiffres
    if (!/^\d+$/.test(zip)) {
        $toast({
            description: `Seulement des chiffres autorisés`,
        });

        formData.zipCodes = formData.zipCodes.filter(z => z !== zip);
        return;
    }

    // logique existante
    const citiesFromZip = await getCityFromZipCode(zip);
    if (!citiesFromZip) return;

    const citiesSet = new Set(formData.cities);
    citiesFromZip.forEach(city => citiesSet.add(city));
    formData.cities = Array.from(citiesSet);

    openProposalDialog(zip);
};

const onCityAdded = async (city: string) => {
    const zipCode = await getZipCodeFromCity(city);
    if (zipCode && !formData.zipCodes.includes(zipCode)) {
        formData.zipCodes = [...formData.zipCodes, zipCode];
    }
    openProposalDialog(city);
};

const handleCareTypeClick = (timeSlot, careTypes) => {
    const index = timeSlot.careTypes.indexOf(careTypes);
    if (index === -1) {
        timeSlot.careTypes.push(careTypes);
    }
    else {
        timeSlot.careTypes.splice(index, 1);
    }
    timeSlot.careTypes = [...timeSlot.careTypes];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const pendingReplacement = useState('pendingReplacement', () => null);
const { submit, inProgress } = useSubmit(async () => {
    try {
        const result = await sendUrgentReplacement(formData);
        if (result === true) {
            $toast({
                description: 'Création du remplacement rapide effectuée',
            });

            setTimeout(() => {
                navigateTo('/dashboard/replacements/me');
            }, 2000);
        }
    }
    catch (err) {
        if (err.response?.status === 401) {
            pendingReplacement.value = formData;
            return navigateTo('/register-immediate');
        }
        console.error('Erreur soumise:', err);
        throw err;
    }
});

useHead({
    title: 'Remplacement rapide',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
