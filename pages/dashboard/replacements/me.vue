<template>
    <div>
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Rechercher des
                <strong>
                    remplacements
                </strong>
            </h1>
        </div>

        <div class="flex mt-6">
            <Form
                class="grid grid-cols-5 w-full gap-4"
            >
                <div class="col-span-4 md:col-span-2 lg:col-span-1">
                    <FormField name="days">
                        <FormItem>
                            <FormControl>
                                <div class="flex bg-primary space-x-3 rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Jours
                                    </h5>
                                    <Select>
                                        <SelectTrigger
                                            class="bg-white my-0.5 w-36 rounded-full flex space-x-1 lg:space-x-2 border border-none lg:text-sm md:text-xs"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="selectedDaysPlaceholder"
                                                class="text-xs w-[200%] truncate"
                                            />
                                        </SelectTrigger>

                                        <SelectContent class="border border-none">
                                            <SelectGroup class="w-32">
                                                <div
                                                    v-for="(day, index) in days"
                                                    :key="index"
                                                    class="flex items-center space-2 mb-2"
                                                >
                                                    <Checkbox
                                                        class="mr-2"
                                                        :checked="formData.selectedDays.includes(day)"
                                                        @update:checked="toggleDay(day)"
                                                    />
                                                    <label class="text-xs">{{ frenchDays[day] }}</label>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:w-[22rem]">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">CP</span>
                                        <span class="hidden xl:inline-block">Codes postaux</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.postalCodeTags"
                                        class="w-[14rem] flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                                    >
                                        <div
                                            :class="Array.isArray(formData.postalCodeTags) && formData.postalCodeTags.length ? 'w-1/2' : 'hidden'"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.postalCodeTags"
                                                :key="item"
                                                :value="item"
                                                class="flex-shrink-0 max-w-24"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete
                                                    @click="removePostalCodeTag(item)"
                                                />
                                            </TagsInputItem>
                                        </div>

                                        <TagsInputInput
                                            v-model="postalCodeInput"
                                            :class="Array.isArray(formData.postalCodeTags) && formData.postalCodeTags.length ? 'w-1/2' : 'w-full'"
                                            class="text-xs flex items-center"
                                            placeholder="8793"
                                            @keydown.enter="addPostalCodeTag"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4  md:col-span-2 lg:col-span-1 lg:-ms-16 lg:w-72">
                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez la vile puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="hidden xl:inline-block">Ville</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.cityTags"
                                        class="flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                                    >
                                        <div
                                            :class="Array.isArray(formData.cityTags) && formData.cityTags.length ? 'w-1/2' : 'hidden'"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.cityTags"
                                                :key="item"
                                                :value="item"
                                                class="flex-shrink-0 max-w-24"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete
                                                    @click="removeCityTag(item)"
                                                />
                                            </TagsInputItem>
                                        </div>

                                        <TagsInputInput
                                            v-model="cityInput"
                                            :class="Array.isArray(formData.cityTags) && formData.cityTags.length ? 'w-1/2' : 'w-full'"
                                            class="text-xs flex items-center"
                                            placeholder="City38"
                                            @keydown.enter="addCityTag"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="flex gap-3">
                    <Button
                        class="bg-primary"
                        @click="reinitializeFilter"
                    >
                        <ArrowPathIcon class="w-6" />
                    </Button>
                    <Button
                        class=" text-sm bg-primary"
                        @click="submit"
                    >
                        <MagnifyingGlassIcon class="w-6" />
                        Rechercher
                    </Button>
                </div>
            </Form>
        </div>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 rounded-t-lg border-none">
                        <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary w-full grid grid-cols-3 justify-center items-center text-white text-xs">
                            <span>Matin</span>
                            <span>Midi</span>
                            <span>Soir</span>
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Type de soin
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody class="rounded-b-lg">
                    <div v-if="loading && loadingSearch">
                        <TableRow
                            v-for="(_, index) in Array.from({ length: 10 })"
                            :key="index"
                            class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden"
                        >
                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>
                        </TableRow>
                    </div>
                    <div v-else-if="currentReplacements.length === 0">
                        <p class="text-center text-gray-500 py-8">
                            Aucun résultat n'est trouvé
                        </p>
                    </div>
                    <div v-else>
                        <TableRow
                            v-for="replacement in currentReplacements"
                            :key="replacement.id"
                            class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden"
                        >
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] xl:text-[0.75em] lg:text-[0.5em]">
                                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                    <span>{{ formatDate(replacement.start_date) }}</span>
                                </div>
                                <span class="flex items-center">au</span>
                                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                    <span>{{ formatDate(replacement.end_date) }}</span>
                                </div>
                            </TableCell>

                            <TableCell class="grid grid-cols-3 justify-center items-center bg-[#F1F2F7] text-xs">
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'morning')"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'afternoon')"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'evening')"
                                    class="h-6 mx-auto text-green-500"
                                />
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div
                                    class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 justify-center items-center overflow-hidden"
                                >
                                    <p class="truncate w-full px-2 pt-3 h-10 rounded">
                                        <span
                                            v-for="(detail, index) in replacement.details"
                                            :key="index"
                                            :class="cn('mr-1', {
                                                'text-success font-bold': hasMatchingZipCode(detail),
                                            })"
                                        >
                                            {{ detail?.patient?.zip_code }},
                                        </span>
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div
                                    class="flex truncate h-10 bg-[#E4E7F4] rounded mt-3 justify-center items-center overflow-hidden"
                                >
                                    <p class="truncate w-full px-2 pt-3 h-10 rounded">
                                        <span
                                            v-for="(detail, index) in replacement.details"
                                            :key="index"
                                            :class="cn('mr-1', {
                                                'text-success font-bold': hasMatchingCity(detail),
                                            })"
                                        >
                                            {{ detail?.patient?.city }},
                                        </span>
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-[#E4E7F4] mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>

                            <TableCell class="text-xs text-center bg-[#F1F2F7] pt-6 overflow-x-hidden">
                                <Button
                                    class="inline-block h-10 rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                    :href="`/dashboard/replacements/detail/${replacement.id}`"
                                >
                                    <EyeIcon class="h-6 mt-1" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </div>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, CheckCircleIcon, EyeIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';

import { useReplacements, useSearchReplacements } from '~/composables/useReplacements';
import { cn } from '@/lib/utils';

useHead({
    title: 'Mes remplacements',
});

const { loading, getMyReplacements } = useReplacements();
const { loadingSearch, fetchReplacements } = useSearchReplacements();

const initialReplacements = ref(await getMyReplacements());
const currentReplacements = ref(initialReplacements.value.data);

onMounted(() => {
    getMyReplacements();
});

const postalCodeInput = ref('');
const cityInput = ref('');

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getShift = (startAt) => {
    if (!startAt) return null;

    const [hours] = startAt.split(':').map(Number);

    if (hours >= 0 && hours < 12) {
        return 'morning';
    }
    if (hours >= 12 && hours < 18) {
        return 'afternoon';
    }
    return 'evening';
};

const hasShift = (details, period) => {
    return details.some(detail => getShift(detail.start_at) === period);
};

const formData = reactive({
    postalCodeTags: [],
    cityTags: [],
    selectedDays: [],
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'Saturday', 'Sunday', 'all'];
const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
    all: 'Tous',
};

const toggleDay = (day) => {
    if (formData.selectedDays.includes(day)) {
        const index = formData.selectedDays.indexOf(day);
        formData.selectedDays.splice(index, 1);
    }
    else {
        formData.selectedDays.push(day);
    }
};

const selectedDaysPlaceholder = computed(() => {
    if (formData.selectedDays.length === 0) {
        return 'Sélectionner';
    }
    return formData.selectedDays.map(day => frenchDays[day]).join(', ');
});

const isSubmitted = ref(false);

const hasMatchingZipCode = (detail) => {
    if (!isSubmitted.value) return false;
    return formData.postalCodeTags.indexOf(detail?.patient?.zip_code) !== -1;
};

const hasMatchingCity = (detail) => {
    if (!isSubmitted.value) return false;
    return formData.cityTags.indexOf(detail?.patient?.city) !== -1;
};

const addPostalCodeTag = () => {
    if (postalCodeInput.value.trim() !== '') {
        formData.postalCodeTags.push(postalCodeInput.value.trim());
        postalCodeInput.value = '';
    }
};

const removePostalCodeTag = (tag) => {
    formData.postalCodeTags = formData.postalCodeTags.filter(t => t !== tag);
};

const addCityTag = () => {
    if (cityInput.value.trim() !== '') {
        formData.cityTags.push(cityInput.value.trim());
        cityInput.value = '';
    }
};

const removeCityTag = (tag) => {
    formData.cityTags = formData.cityTags.filter(t => t !== tag);
};

const submit = async () => {
    isSubmitted.value = true;

    const hasSearchCriteria = formData.selectedDays.length > 0 || formData.postalCodeTags.length > 0 || formData.cityTags.length > 0;

    try {
        if (hasSearchCriteria) {
            const response = await fetchReplacements({
                selectedDays: Array.from(formData.selectedDays),
                postalCode: toRaw(formData.postalCodeTags),
                cities: toRaw(formData.cityTags),
            });
            currentReplacements.value = response.replacements.data;
        }
        else {
            currentReplacements.value = initialReplacements.value;
        }
    }
    catch (error) {
        console.error('Error during search:', error);
    }
};

const reinitializeFilter = () => {
    formData.postalCodeTags = [];
    formData.cityTags = [];
    formData.selectedDays = [];
};

watch(() => formData.postalCodeTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});
watch(() => formData.cityTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});
watch(() => formData.selectedDays, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(
    [
        () => formData.postalCodeTags,
        () => formData.cityTags,
        () => formData.selectedDays,
    ],
    ([newPostalCodes, newCities, newDays]) => {
        if (
            newPostalCodes.length === 0
            && newCities.length === 0
            && newDays.length === 0
        ) {
            currentReplacements.value = initialReplacements.value.data;
            isSubmitted.value = false;
        }
        else if (isSubmitted.value) {
            submit();
        }
    },
    { deep: true },
);

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
