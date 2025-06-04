<template>
    <form @submit.prevent="submit">
        <section class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="sm:mx-12 lg:mx-6">
                <div class="shadow pb-8">
                    <h2 class="text-white font-medium text-center bg-primary py-4 rounded-t-lg">
                        Sélectionner la période de remplacement
                    </h2>
                    <RangeCalendar
                        v-model="value"
                        class="flex flex-col justify-center md:block p-4 rounded-b-lg mb-6"
                    />
                    <div class="mb-6 relative -mt-4 text-center text-black/50">
                        <hr class="border-b border-gray-200 mx-8">
                        <p class="absolute -top-5 left-[45%] text-center bg-white p-3 text-black/60">
                            OU
                        </p>
                    </div>
                    <div class="flex flex-col space-y-4 justify-center items-center mx-auto">
                        <h2 class="text-center font-semibold text-black/70">
                            Saisir manuellement la date
                        </h2>
                        <div class="flex flex-col md:flex-row justify-center gap-6 md:gap-16 2xl:gap-32">
                            <div class="flex flex-col space-y-2">
                                <label class="font-semibold text-primary text-sm text-center">
                                    Date de début
                                </label>
                                <Input
                                    v-model="startDateInput"
                                    type="date"
                                    class="outline-gray-200 rounded-full"
                                />
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="font-semibold text-primary text-sm text-center">
                                    Date de fin
                                </label>
                                <Input
                                    v-model="endDateInput"
                                    type="date"
                                    class="outline-gray-200 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <label class="text-primary sm:flex sm:justify-center sm:items-center font-semibold">
                            Créneau horaire
                        </label>
                        <div class="mt-2 flex sm:justify-center space-x-5 sm:space-x-8 items-center">
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
            </div>

            <div class="flex flex-col space-y-4 text-sm sm:mx-10 lg:mx-0 lg:mr-12">
                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
                        Nombre de patients par jour
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
                    :comma-validation="false"
                    :count="4"
                    @keydown.enter.prevent
                />

                <InputTagManager
                    v-model="formData.cities"
                    label="Villes"
                    placeholder="Anvers, Bruges, Gand"
                    :is-mobile="isMobileView"
                    class="mt-4"
                    :comma-validation="true"
                    :no-space-validation="true"
                    @keydown.enter.prevent
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
                        Pour le remplacement, j'accepte uniquement (sexe):
                    </label>
                    <Select v-model="formData.preferedGender">
                        <SelectTrigger
                            class="w-full bg-white rounded-full text-nowrap border border-gray-300"
                        >
                            <SelectValue placeholder="Sélectionner">
                                <span v-if="formData.preferedGender === 'M'">Homme</span>
                                <span v-else-if="formData.preferedGender === 'F'">Femme</span>
                                <span v-else>Tous</span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectItem value="M">
                                Homme
                            </SelectItem>
                            <SelectItem value="F">
                                Femme
                            </SelectItem>
                            <SelectItem value="all">
                                Tous
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p class="text-xs text-slate-500 ml-1">
                        Pour plus de réussite dans vos recherches, privilégiez "<span class="font-bold text-primary">Tous</span>".
                    </p>
                </div>

                <div class="flex flex-col space-y-2">
                    <label class="text-primary font-semibold">
                        Description
                    </label>
                    <Textarea
                        v-model="formData.comment"
                        placeholder="Décrivez en quelques mots votre demande de remplacement..."
                        rows="11"
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
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import type { DateRange } from 'reka-ui';
import { InputTime } from '@/components/ui/input-time';
import { useReplacements } from '@/composables/useReplacements';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import { formatRange } from '~/lib/utils';

const { careTypes, fetchCareTypes } = useCareTypes();
const { submitReplacement } = useReplacements();
const router = useRouter();

const start = today(getLocalTimeZone());
const end = null;

const { $toast } = useNuxtApp();

const value = ref({
    start,
    end,
}) as Ref<DateRange>;

const formData = reactive({
    startDate: formatRange(value.value).start,
    endDate: null,
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
    preferedGender: 'all',
});

const startDateInput = computed({
    get: () => value.value.start ? value.value.start.toString() : '',
    set: (date: string) => {
        if (date) {
            value.value.start = parseDate(date);
            formData.startDate = formatRange(value.value).start;
        }
    },
});

const endDateInput = computed({
    get: () => value.value.end ? value.value.end.toString() : '',
    set: (date: string) => {
        if (date) {
            value.value.end = parseDate(date);
            formData.endDate = formatRange(value.value).end;
        }
        else {
            value.value.end = null;
            formData.endDate = null;
        }
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

const isMobileView = ref(false);

onMounted(() => {
    if (import.meta.client) {
        isMobileView.value = window.innerWidth <= 1024;
    }
});

await fetchCareTypes();

const resetForm = () => {
    value.value = { start: today(getLocalTimeZone()), end: null };
    formData.startDate = formatRange(value.value).start;
    formData.endDate = null;
    formData.patientCount = null;
    formData.zipCodes = [];
    formData.cities = [];
    formData.careTypes = [];
    formData.timeSlot.startAt = '';
    formData.timeSlot.endAt = '';
    formData.comment = '';
    formData.zipCodesInput = '';
    formData.citiesInput = '';
    formData.preferedGender = 'all';
};

const { submit, inProgress } = useSubmit(async () => {
    const formatted = formatRange(value.value);
    formData.startDate = formatted.start;
    formData.endDate = formatted.end;
    await submitReplacement(formData);
}, {
    onSuccess: () => {
        $toast({
            description: 'Création effectuée',
        });
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
