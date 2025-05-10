<template>
    <form @submit.prevent="submit">
        <section class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="sm:mx-12 lg:mx-6">
                <div class="shadow">
                    <h2 class="text-white font-medium text-center bg-primary py-4 rounded-t-lg">
                        Sélectionner la période de remplacement
                    </h2>
                    <RangeCalendar
                        v-model="value"
                        class="flex flex-col justify-center md:block p-4 rounded-b-lg mb-8"
                    />
                </div>

                <div class="mt-8">
                    <label class="text-primary font-semibold">
                        Créneau horaire
                    </label>
                    <div class="mt-2 flex space-x-5 sm:space-x-8 items-center">
                        <InputTime
                            v-model="formData.timeSlot.startAt"
                            class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                            input-class="rounded-full"
                        />
                        <p>à</p>
                        <InputTime
                            v-model="formData.timeSlot.endAt"
                            class="w-20 sm:w-48 lg:w-20 2xl:w-48"
                            input-class="rounded-full"
                        />
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-6 text-sm sm:mx-10 lg:mx-0 lg:mr-12">
                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
                        Nombre de patients
                    </label>
                    <InputIcon
                        v-model="formData.patientCount"
                        placeholder="Entrer un nombre"
                    />
                </div>

                <InputTagManager
                    v-model="formData.zipCodes"
                    label="Codes postaux"
                    placeholder="6565,4561,1237"
                    :is-mobile="isMobileView"
                    :only-comma-validation="false"
                />

                <InputTagManager
                    v-model="formData.cities"
                    label="Villes"
                    placeholder="Anvers, Bruges, Gand"
                    :is-mobile="isMobileView"
                    class="mt-4"
                    :only-comma-validation="true"
                />

                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
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
                    <label class="text-primary font-semibold">
                        Commentaire
                    </label>
                    <Textarea
                        v-model="formData.comment"
                        placeholder="Écrivez un commentaire"
                        rows="8"
                        class="w-full border border-gray-400 focus-within:border-primary"
                    />
                </div>
            </div>
        </section>

        <Button
            class="flex items-center justify-center mx-auto mt-16 mb-8 2xl:mt-24 w-72"
            type="submit"
            :in-progress="inProgress"
        >
            Enregistrer
        </Button>
    </form>
</template>

<script lang="ts" setup>
import { getLocalTimeZone, today } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { InputTime } from '@/components/ui/input-time';
import { useReplacements } from '@/composables/useReplacements';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';

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
    endDate: ``,
    patientCount: null,
    zipCodes: [],
    cities: [],
    careTypes: [],
    timeSlot: {
        startAt: '',
        endAt: '',
    },
    comment: '',
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

const isMobileView = ref(false);

onMounted(() => {
    if (import.meta.client) {
        isMobileView.value = window.innerWidth <= 1024;
    }
});

await fetchCareTypes();

const resetForm = () => {
    formData.startDate = `${value.value.start.year}-${String(value.value.start.month).padStart(2, '0')}-${String(value.value.start.day).padStart(2, '0')}`;
    formData.endDate = `${value.value.end.year}-${String(value.value.end.month).padStart(2, '0')}-${String(value.value.end.day).padStart(2, '0')}`;
    formData.patientCount = null;
    formData.zipCodes = [];
    formData.cities = [];
    formData.careTypes = [];
    formData.timeSlot.startAt = '';
    formData.timeSlot.endAt = '';
    formData.comment = '';
    formData.zipCodesInput = '';
    formData.citiesInput = '';
};

const { submit, inProgress } = useSubmit(async () => {
    formData.endDate = `${value.value.end.year}-${String(value.value.end.month).padStart(2, '0')}-${String(value.value.end.day).padStart(2, '0')}`;
    await submitReplacement(formData);
    resetForm();
});

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
