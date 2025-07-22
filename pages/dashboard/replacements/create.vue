<template>
    <form
        class="lg:ml-20 xl:ml-0"
        @submit.prevent="submit"
    >
        <section class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 2xl:px-24">
            <div class="sm:mx-12 lg:mx-6">
                <div class="shadow pb-8">
                    <h2 class="text-white font-medium text-center bg-primary lg:px-2 px-0 py-4 rounded-t-lg">
                        Sélectionner les périodes de remplacement
                    </h2>

                    <MultiRangeCalendar
                        v-model="calendarValue"
                        class="flex flex-col justify-center md:block p-4 rounded-b-lg mb-6"
                        @update:model-value="handleCalendarUpdate"
                    />

                    <div class="mb-10 relative -mt-1 text-center text-black/50">
                        <hr class="border-b border-gray-200 mx-8">
                        <p class="absolute -top-5 left-[45%] text-center bg-white p-3 text-black/60">
                            OU
                        </p>
                    </div>

                    <div class="flex flex-col space-y-4 justify-center items-center mx-auto">
                        <h2 class="text-center font-semibold text-black/70">
                            Saisir manuellement les périodes
                        </h2>
                        <div class="flex flex-col space-y-4 w-full px-4 gap-6">
                            <div
                                v-for="(period, index) in formData.periods"
                                :key="index"
                                class="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-center relative gap-4 xl:gap-12 2xl:gap-20 items-center"
                            >
                                <div class="flex flex-col space-y-1">
                                    <label class="font-semibold text-primary text-sm text-center">
                                        Date de début
                                    </label>
                                    <input
                                        v-model="period.startDate"
                                        type="date"
                                        class="outline-gray-200 rounded-full border border-gray-300 px-3 py-1"
                                        @change="handleManualDateUpdate(index)"
                                    >
                                </div>
                                <div class="flex flex-col space-y-1">
                                    <label class="font-semibold text-primary text-sm text-center">
                                        Date de fin
                                    </label>
                                    <input
                                        v-model="period.endDate"
                                        type="date"
                                        class="outline-gray-200 rounded-full border border-gray-300 px-3 py-1"
                                        @change="handleManualDateUpdate(index)"
                                    >
                                </div>
                                <XMarkIcon
                                    v-if="formData.periods.length > 1"
                                    class="w-5 h-5 mt-2 md:mt-6 lg:top-4 xl:-top-8 2xl:top-2 right-0 text-primary absolute cursor-pointer"
                                    @click="removePeriod(index)"
                                />
                            </div>
                        </div>
                        <Button
                            class="mt-4 mx-auto rounded-full flex space-x-1 items-center cursor-pointer"
                            size="sm"
                            @click="addPeriod"
                        >
                            <PlusIcon
                                class="w-5 h-5"
                            />
                            <span>
                                Ajouter période
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-4 text-sm sm:mx-10 lg:mx-0 lg:mr-12">
                <div>
                    <label class="text-primary font-semibold">
                        Créneau horaire
                    </label>
                    <div class="mt-2 grid sm:grid-cols-[20%_80%] lg:grid-cols-1 xl:grid-cols-[12%_88%] 2xl:grid-cols-[10%_90%] xl:space-x-8 items-center">
                        <label class="font-medium text-gray-700">
                            Matin :
                        </label>
                        <div class="lg:mt-2 xl:mt-0 flex space-x-2 sm:space-x-5 lg:space-x-2 xl:space-x-3 2xl:space-x-5 items-center">
                            <p>De</p>
                            <InputTime
                                v-model="formData.timeSlot.morning.startAt"
                                input-class="rounded-full"
                            />
                            <p>à</p>
                            <InputTime
                                v-model="formData.timeSlot.morning.endAt"
                                input-class="rounded-full"
                            />
                        </div>
                    </div>
                    <div class="mt-4 grid sm:grid-cols-[20%_80%] lg:grid-cols-1 xl:grid-cols-[12%_88%] 2xl:grid-cols-[10%_90%] xl:space-x-8 items-center">
                        <label class="font-medium text-gray-700">
                            Soir :
                        </label>
                        <div class="lg:mt-2 xl:mt-0 flex space-x-2 sm:space-x-5 lg:space-x-2 xl:space-x-3 2xl:space-x-5 items-center">
                            <p>De</p>
                            <InputTime
                                v-model="formData.timeSlot.evening.startAt"
                                class="w-full"
                                input-class="rounded-full"
                            />
                            <p>à</p>
                            <InputTime
                                v-model="formData.timeSlot.evening.endAt"
                                class="w-full"
                                input-class="rounded-full"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
                        Nombre de patients par jour
                    </label>
                    <InputIcon
                        v-model="formData.patientCount"
                        placeholder="Entrer un nombre"
                    />
                </div>

                <div class="relative">
                    <InputTagManager
                        v-model="formData.zipCodes"
                        label="Codes postaux"
                        placeholder="6565,4561,1237"
                        :is-mobile="isMobile"
                        :comma-validation="false"
                        :count="4"
                        @keydown.enter.prevent
                        @item-added="onZipCodeAdded"
                        @open-proposal="openProposalDialog"
                    />

                    <Button
                        variant="inline"
                        class="absolute -top-[1.2rem] right-0 font-bold text-primary text-xs mt-2"
                        @click="openProposalDialog('')"
                    >
                        Boost IA
                    </Button>
                </div>

                <InputTagManager
                    v-model="formData.cities"
                    label="Villes"
                    placeholder="Anvers, Bruges, Gand"
                    :is-mobile="isMobile"
                    class="mt-4"
                    :comma-validation="true"
                    :no-space-validation="true"
                    @keydown.enter.prevent
                    @item-added="onCityAdded"
                    @open-proposal="openProposalDialog"
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
                                    class="flex items-center space-x-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
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
                        Description
                    </label>
                    <Textarea
                        v-model="formData.comment"
                        placeholder="Décrivez en quelques mots votre demande de remplacement..."
                        rows="8"
                        class="w-full border border-gray-400 focus-within:border-primary"
                    />
                </div>
            </div>
        </section>

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
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { InputTime } from '@/components/ui/input-time';
import { useReplacements } from '@/composables/useReplacements';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import MultiRangeCalendar from '@/components/MultiRangeCalendar.vue';

const { getZipCodeFromCity } = useOpenai();
const { getCitiesFomZipCode } = useLocation();
const { careTypes, fetchCareTypes } = useCareTypes();
const { submitReplacement } = useReplacements();
const router = useRouter();
const { $toast } = useNuxtApp();

const isMobile = ref(false);
onMounted(() => {
    if (import.meta.client) {
        isMobile.value = window.innerWidth <= 1024;
    }
});

await fetchCareTypes();

const formData = reactive({
    periods: [
        {
            startDate: '',
            endDate: '',
        },
    ],
    patientCount: null as number | null,
    zipCodes: [] as string[],
    cities: [] as string[],
    careTypes: [] as number[],
    timeSlot: {
        morning: {
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

const onZipCodeAdded = async (zip: string) => {
    const citiesFromZip = await getCitiesFomZipCode(zip);
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

const calendarValue = ref<{ start: string | null; end: string | null }[]>([
    { start: null, end: null },
]);

watch(
    () => formData.periods,
    () => {
        calendarValue.value = formData.periods.map(period => ({
            start: period.startDate || null,
            end: period.endDate || null,
        }));
    },
    { deep: true },
);

const handleCalendarUpdate = (ranges: { start: string | null; end: string | null }[]) => {
    if (!Array.isArray(ranges)) {
        console.error('Expected ranges to be an array:', ranges);
        return;
    }
    if (formData.periods.length === 1 && !formData.periods[0].startDate && !formData.periods[0].endDate) {
        formData.periods[0] = {
            startDate: ranges[0]?.start || null,
            endDate: ranges[0]?.end || null,
        };
    }
    else {
        formData.periods = ranges.map(range => ({
            startDate: range.start || null,
            endDate: range.end || null,
        }));
    }
};

const handleManualDateUpdate = (index: number) => {
    const period = formData.periods[index];
    if (period.startDate && period.endDate) {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        if (startDate > endDate) {
            formData.periods[index] = {
                startDate: period.endDate,
                endDate: period.startDate,
            };
        }
    }
    calendarValue.value = formData.periods.map(period => ({
        start: period.startDate || null,
        end: period.endDate || null,
    }));
};

const addPeriod = () => {
    formData.periods.push({
        startDate: null,
        endDate: null,
    });
    calendarValue.value.push({ start: null, end: null });
};

const removePeriod = (index: number) => {
    formData.periods.splice(index, 1);
    calendarValue.value.splice(index, 1);
};

const handleCareTypeClick = (formData, careTypeId) => {
    const index = formData.careTypes.indexOf(careTypeId);
    if (index === -1) {
        formData.careTypes.push(careTypeId);
    }
    else {
        formData.careTypes.splice(index, 1);
    }
    formData.careTypes = [...formData.careTypes];
};

const getSelectedCareTypesText = (selectedIds: number[]): string => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const resetForm = () => {
    formData.periods = [{
        startDate: null,
        endDate: null,
    }];
    calendarValue.value = [{ start: null, end: null }];
    formData.patientCount = null;
    formData.zipCodes = [];
    formData.cities = [];
    formData.careTypes = [];
    formData.timeSlot.morning.startAt = null;
    formData.timeSlot.morning.endAt = null;
    formData.timeSlot.evening.startAt = null;
    formData.timeSlot.evening.endAt = null;
    formData.comment = '';
    formData.zipCodesInput = '';
    formData.citiesInput = '';
};

const { submit, inProgress } = useSubmit(async () => {
    await submitReplacement(formData);
}, {
    onSuccess: () => {
        $toast({ description: 'Création effectuée' });
        resetForm();
        setTimeout(() => {
            router.push('/dashboard/replacements/me');
        }, 2000);
    },
});

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
