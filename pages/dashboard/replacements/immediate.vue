<template>
    <div class="space-y-6">
        <div class="bg-gray-100 flex items-center px-6 rounded-lg w-full h-12">
            <img
                src="/public/images/home/help_me.png"
                class="h-10 w-10 object-contain mr-3"
                alt="Aide"
            >
            <h1 class="text-primary text-sm font-medium">
                Remplacement immédiat
                <strong class="font-semibold">
                    pour aujourd'hui
                </strong>
            </h1>
        </div>

        <Form @submit="submit">
            <div class="bg-gray-100 rounded-xl px-6 sm:px-8 md:px-10 py-8 mx-auto max-w-5xl w-full">
                <h3 class="text-center text-lg text-primary py-4 font-bold">
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
                                class="w-full bg-white text-sm text-gray-700 focus:outline-none rounded-full border border-primary h-11 px-3"
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            class="relative group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-10 before:left-0 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1 before:content-['Appuyer_sur_Espace_pour_valider']"
                        >
                            <div class="grid grid-cols-[35%_65%] border border-primary h-11 rounded-full overflow-hidden">
                                <div class="bg-primary flex items-center justify-center text-white text-sm font-medium px-4">
                                    <label for="zipCodes">Codes postaux *</label>
                                </div>
                                <Input
                                    id="zipCodes"
                                    v-model="formData.zipCodesInput"
                                    placeholder="1090, 1190"
                                    class="w-full bg-white text-sm text-gray-700 focus:outline-none"
                                    @keyup="handleZipCodeKeys"
                                />
                            </div>

                            <div v-if="formData.zipCodes.length" class="flex flex-wrap gap-2 mt-2">
                                <div
                                    v-for="(zip, index) in formData.zipCodes"
                                    :key="index"
                                    class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                                >
                                    {{ zip }}
                                    <button
                                        type="button"
                                        class="ml-2 text-gray-500 hover:text-gray-700 relative z-10"
                                        @click="removeZipCode(index)"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            class="relative group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-10 before:left-0 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1 before:content-['Appuyer_sur_Espace_pour_valider']"
                        >
                            <div class="grid grid-cols-[35%_65%] border border-primary h-11 rounded-full overflow-hidden">
                                <div class="bg-primary flex items-center justify-center text-white text-sm font-medium px-4">
                                    <label for="cities">Villes *</label>
                                </div>
                                <Input
                                    id="cities"
                                    v-model="formData.citiesInput"
                                    placeholder="Bruxelles, Bruges"
                                    class="w-full bg-white text-sm text-gray-700 focus:outline-none"
                                    @keyup="handleCityKeys"
                                />
                            </div>

                            <div v-if="formData.cities.length" class="flex flex-wrap gap-2 mt-2">
                                <div
                                    v-for="(city, index) in formData.cities"
                                    :key="index"
                                    class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                                >
                                    {{ city }}
                                    <button
                                        type="button"
                                        class="ml-2 text-gray-500 hover:text-gray-700"
                                        @click="removeCity(index)"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-[30%_70%] items-center mt-4">
                        <h5>Type de soin</h5>
                        <Select
                            v-model="formData.careTypes"
                            multiple
                        >
                            <SelectTrigger
                                class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                position="right"
                            >
                                <SelectValue class="truncate w-[200rem]">
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
import { InputTime } from '@/components/ui/input-time';

useHead({
    title: 'Remplacement rapide',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth-help', 'subscribed'],
    ssr: false,
});

const { careTypes, fetchCareTypes } = useCareTypes();
const { $toast } = useNuxtApp();
const { sendUrgentReplacement } = useReplacements();

const formData = reactive({
    startTime: '',
    endTime: '',
    patientCount: '',
    zipCodes: [],
    cities: [],
    careTypes: [],
    zipCodesInput: '',
    citiesInput: '',
});

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

const handleZipCodeKeys = (event) => {
    const keys = [' ', ',', 'Enter'];
    if (keys.includes(event.key)) {
        event.preventDefault();
        let value = formData.zipCodesInput.trim();
        value = value.replace(/[, ]$/, '');
        if (value && !formData.zipCodes.includes(value)) {
            formData.zipCodes.push(value);
        }
        formData.zipCodesInput = '';
    }
};

const removeZipCode = (index) => {
    formData.zipCodes.splice(index, 1);
};

const handleCityKeys = (event) => {
    const keys = [' ', ',', 'Enter'];
    if (keys.includes(event.key)) {
        event.preventDefault();
        let value = formData.citiesInput.trim();
        value = value.replace(/[, ]$/, '');
        if (value && !formData.cities.includes(value)) {
            formData.cities.push(value);
        }
        formData.citiesInput = '';
    }
};

const removeCity = (index) => {
    formData.cities.splice(index, 1);
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        $toast({
            description: 'Création du remplacement rapide effectuée',
        });
        sendUrgentReplacement(formData);
        setTimeout(() => {
            navigateTo('/dashboard/replacements/me');
        }, 3000);
    }
    catch (err) {
        console.error('Error:', err);
        $toast({
            description: 'Une erreur s\'est produite',
            status: 'error',
            variant: 'destructive',
        });
    }
});

onMounted(() => {
    fetchCareTypes();
});
</script>
