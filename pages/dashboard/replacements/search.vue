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
                                <div class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1">
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
                                <TagsInput
                                    v-model="formData.cityTags"
                                    class="flex items-center bg-gray-100 text-xs rounded-full border border-none"
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
                                        class="text-xs flex items-center bg-gray-100"
                                        placeholder="Ville"
                                        @keydown.enter="addCityTag"
                                    />
                                </TagsInput>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <Button
                    class="col-span-4 md:col-span-2 lg:col-span-1 lg:w-36 lg:ms-12 text-sm bg-primary"
                    @click="submit"
                >
                    <MagnifyingGlassIcon class="w-6" />
                    Rechercher
                </Button>
            </Form>
        </div>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center rounded-lg text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary grid grid-cols-3 justify-center items-center rounded-lg text-white text-xs">
                            <span>Matin</span>
                            <span>Midi</span>
                            <span>Soir</span>
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Type de soin
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <div v-if="loading">
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
                    <div v-else>
                        <TableRow
                            v-for="replacement in replacements.data"
                            :key="replacement.id"
                            class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden"
                        >
                            <TableCell class="flex justify-center items-center bg-gray-100 xl:text-[0.75em] lg:text-[0.5em]">
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.start_date) }}</span>
                                </div>
                                <span class="flex items-center">au</span>
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.end_date) }}</span>
                                </div>
                            </TableCell>

                            <TableCell class="grid grid-cols-3 justify-center items-center bg-gray-100 text-xs">
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

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex h-10 rounded mt-3 justify-center items-center"
                                    :class="[
                                        'bg-gray-200',
                                        hasMatchingZipCode(replacement.details) ? 'bg-success text-white' : '',
                                    ]"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.zip_code)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex h-10 rounded mt-3 justify-center items-center overflow-hidden"
                                    :class="[
                                        'bg-gray-200',
                                        hasMatchingCity(replacement.details) ? 'bg-success text-white' : '',
                                    ]"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.city)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-gray-200 mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>

                            <TableCell class="text-xs pt-6 overflow-x-hidden">
                                <Button
                                    class="flex h-10 rounded bg-gray-200 text-black hover:text-white mx-auto justify-center items-center"
                                    :href="`/dashboard/replacements/detail/${replacement.id}`"
                                >
                                    <span class="text-xs">Voir plus</span>
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
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';

import { useSearchReplacements } from '~/composables/useReplacements';

useHead({
    title: 'Liste des remplacements',
});

const { loading, replacements, fetchReplacements } = useSearchReplacements();

onMounted(() => {
    fetchReplacements();
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

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'Saturday', 'Sunday'];
const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
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

const hasMatchingZipCode = (details) => {
    if (!isSubmitted.value) return false;
    const zipCodes = details?.map(detail => detail?.patient?.zip_code) || [];
    return zipCodes.some(zip => formData.postalCodeTags.includes(zip));
};

const hasMatchingCity = (details) => {
    if (!isSubmitted.value) return false;
    const cities = details?.map(detail => detail?.patient?.city) || [];
    return cities.some(city => formData.cityTags.includes(city));
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

const submit = () => {
    isSubmitted.value = true;
    fetchReplacements({
        selectedDays: Array.from(formData.selectedDays),
        postalCode: toRaw(formData.postalCodeTags),
        cities: toRaw(formData.cityTags),
    });
};

watch(() => formData.postalCodeTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});
watch(() => formData.cityTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
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
