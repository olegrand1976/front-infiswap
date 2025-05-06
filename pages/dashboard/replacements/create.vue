<template>
    <Form @submit="submit">
        <section class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="sm:mx-12 lg:mx-6">
                <div class="shadow">
                    <h2 class="text-white font-medium text-center bg-primary py-4 rounded-t-lg">
                        Sélectionnez la rangée de date ici
                    </h2>
                    <RangeCalendar
                        v-model="value"
                        class="flex flex-col justify-center md:block p-4 rounded-b-lg mb-8"
                    />
                </div>

                <div class="mt-8 rounded-b-lg border border-gray-200">
                    <h3 class="w-full text-white font-medium text-center bg-primary py-4 rounded-t-lg">
                        Créneaux horaires
                    </h3>
                    <div class="p-3 sm:p-6 flex flex-col gap-4">
                        <div class="grid grid-cols-4 gap-y-2 lg:gap-y-0 items-center">
                            <p class="col-span-4 sm:col-span-1 font-semibold sm:font-normal">
                                Matin
                            </p>
                            <div class="col-span-4 sm:col-span-3 flex justify-between space-x-2  items-center">
                                <InputTime
                                    v-model="formData.timeSlot.morning.startAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="morning"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.morning.endAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="morning"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-4 gap-y-2 lg:gap-y-0 items-center">
                            <p class="col-span-4 sm:col-span-1 font-semibold sm:font-normal">
                                Après-midi
                            </p>
                            <div class="col-span-4 sm:col-span-3 flex space-x-2 justify-between items-center">
                                <InputTime
                                    v-model="formData.timeSlot.afternoon.startAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="afternoon"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.afternoon.endAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="afternoon"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-4 gap-y-2 lg:gap-y-0 items-center">
                            <p class="col-span-4 sm:col-span-1 font-semibold sm:font-normal">
                                Soir
                            </p>
                            <div class="col-span-4 sm:col-span-3 flex space-x-2 justify-between items-center">
                                <InputTime
                                    v-model="formData.timeSlot.evening.startAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="evening"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.evening.endAt"
                                    class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                                    input-class="rounded-full"
                                    time-range="evening"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-6 text-sm sm:mx-10 lg:mx-0 lg:mr-12">
                <div class="flex flex-col space-y-2">
                    <label
                        class="text-primary font-semibold"
                    >
                        Nombre de patients
                    </label>
                    <InputIcon
                        v-model="formData.patientCount"
                        placeholder="Entrer un nombre"
                    />
                </div>

                <div class="flex flex-col space-y-2 relative group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-2 before:left-4 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1 before:content-['Appuyer_sur_Espace_pour_valider']">
                    <label
                        class="text-primary font-semibold"
                    >
                        Codes postaux
                    </label>
                    <InputIcon
                        id="zipCodes"
                        v-model="formData.zipCodesInput"
                        placeholder="6565,4561,1237"
                        class="w-full"
                        @keyup="handleZipCodeKeys"
                    />

                    <div
                        v-if="formData.zipCodes.length"
                        class="flex flex-wrap gap-2 mt-2"
                    >
                        <div
                            v-for="(zip, index) in formData.zipCodes"
                            :key="index"
                            class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                        >
                            {{ zip }}
                            <button
                                type="button"
                                class="ml-2 text-gray-500 hover:text-gray-700"
                                @click="removeZipCode(index)"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col space-y-2 relative group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-2 before:left-4 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1 before:content-['Appuyer_sur_Espace_pour_valider']">
                    <label
                        class="text-primary font-semibold"
                    >
                        Villes
                    </label>
                    <InputIcon
                        id="cities"
                        v-model="formData.citiesInput"
                        placeholder="Anvers, Bruges, Gand"
                        class="w-full"
                        @keyup="handleCityKeys"
                    />

                    <div
                        v-if="formData.cities.length"
                        class="flex flex-wrap gap-2 mt-2"
                    >
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

                <div class="flex flex-col space-y-2">
                    <label
                        class="text-primary font-semibold"
                    >
                        Type de soins
                    </label>
                    <Select
                        v-model="formData.careTypes"
                        multiple
                    >
                        <SelectTrigger
                            class="w-full bg-white rounded-full text-nowrap border border-gray-300"
                            position="right"
                        >
                            <SelectValue class="truncate w-[200rem]">
                                <template v-if="getSelectedCareTypesText(formData.careTypes)">
                                    {{ getSelectedCareTypesText(formData.careTypes) }}
                                </template>
                                <template v-else>
                                    <span class="text-black/60">
                                        Sélectionner
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

                <div class="flex flex-col space-y-2">
                    <label
                        class="text-primary font-semibold"
                    >
                        Commentaire
                    </label>
                    <Textarea
                        v-model="formData.comment"
                        placeholder="Écrivez un commentaire"
                        rows="13"
                        class="w-full border border-gray-400 focus-within:border-primary"
                    />
                </div>
            </div>
        </section>

        <Button
            class="flex items-center justify-center mx-auto mt-12 2xl:mt-24 w-72"
            type="submit"
        >
            Enregistrer
        </Button>
    </form>
</template>

<script lang="ts" setup>
import { getLocalTimeZone, today } from '@internationalized/date';
import { InputTime } from '@/components/ui/input-time';
import { InputIcon } from '~/components/ui/input-with-icon';
import { useReplacements } from '@/composables/useReplacements';

const { careTypes, fetchCareTypes } = useCareTypes();
const { submitReplacement } = useReplacements();

const start = today(getLocalTimeZone());
const end = null;

const value = ref({
    start,
    end,
}) as Ref<DateRange>;

const formData = reactive({
    startDate: `${value.value.start.year}-${String(value.value.start.month).padStart(2, '0')}-${String(value.value.start.day).padStart(2, '0')}`,
    endDate: '',
    patientCount: null,
    zipCodes: [],
    cities: [],
    careTypes: [],
    timeSlot: {
        morning: {
            startAt: '',
            endAt: '',
        },
        afternoon: {
            startAt: '',
            endAt: '',
        },
        evening: {
            startAt: '',
            endAt: '',
        },
    },
    comment: '',
    zipCodesInput: '',
    citiesInput: '',
});

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

await fetchCareTypes();

const { submit } = useSubmit(async () => {
    formData.endDate = `${value.value.end.year}-${String(value.value.end.month).padStart(2, '0')}-${String(value.value.end.day).padStart(2, '0')}`;
    await submitReplacement(formData);
});

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
