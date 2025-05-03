<template>
    <Form @submit="submit">
        <section class="mt-4 grid grid-cols-2 gap-8">
            <div class="shadow mx-12">
                <h2 class="text-white font-medium text-center bg-primary py-4 rounded-t-lg">
                    Séléctionnez la rangée de date ici
                </h2>
                <RangeCalendar
                    v-model="value"
                    class="flex flex-col justify-center md:block p-4 rounded--b-lg"
                />
            </div>

            <div class="flex flex-col space-y-6 text-sm mr-12">
                <div class="flex flex-col space-y-2">
                    <label
                        class="text-primary font-semibold"
                    >
                        Nombre de patients
                    </label>
                    <input
                        v-model="formData.patientCount"
                        placeholder="Entrer un nombre"
                        class="border p-2 rounded-full"
                    >
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
                            class="w-full bg-white rounded-full text-nowrap border border-gray-200"
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

                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
                        Créneau horaire
                    </label>
                    <div class="w-full flex flex-col items-center gap-4">
                        <div class="flex space-x-16 items-center">
                            <p>Matin</p>
                            <div class="flex space-x-4 justify-between items-center">
                                <InputTime
                                    v-model="formData.timeSlot.morning.startAt"
                                    input-class="rounded-full"
                                    time-range="morning"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.morning.endAt"
                                    input-class="rounded-full"
                                    time-range="morning"
                                />
                            </div>
                        </div>

                        <div class="flex space-x-8 items-center">
                            <p>Après-midi</p>
                            <div class="flex space-x-4 justify-between items-center">
                                <InputTime
                                    v-model="formData.timeSlot.afternoon.startAt"
                                    input-class="rounded-full"
                                    time-range="afternoon"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.afternoon.endAt"
                                    input-class="rounded-full"
                                    time-range="afternoon"
                                />
                            </div>
                        </div>

                        <div class="flex space-x-20 items-center">
                            <p>Soir</p>
                            <div class="flex space-x-4 justify-between items-center">
                                <InputTime
                                    v-model="formData.timeSlot.evening.startAt"
                                    input-class="rounded-full"
                                    time-range="evening"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.evening.endAt"
                                    input-class="rounded-full"
                                    time-range="evening"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Button
            class="flex items-center justify-center mx-auto mt-12 w-72"
            type="submit"
        >
            Enregistrer
        </Button>
    </form>
</template>

<script lang="ts" setup>
import { getLocalTimeZone, today } from '@internationalized/date';
import { InputTime } from '@/components/ui/input-time';
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
    middleware: 'auth',
});
</script>
