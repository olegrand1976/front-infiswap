<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
                Rechercher <span class="ml-1 font-semibold">un partenaire</span>
            </h1>
        </div>

        <form
            class="mt-8 grid grid-cols-7 items-center gap-6 w-full"
            @submit.prevent="search"
        >
            <div class="col-span-1 2xl:col-span-2">
                <Select v-model="searchFormData.duration">
                    <SelectTrigger
                        class="w-[15.5rem] 2xl:w-full"
                        position="right"
                    >
                        <SelectValue
                            placeholder="Durée de collaboration"
                            class="w-[200%] truncate"
                        />
                    </SelectTrigger>
                    <SelectContent class="border border-none">
                        <SelectGroup>
                            <SelectItem
                                v-for="[key, value] in Object.entries(durations)"
                                :key="key"
                                :value="key"
                            >
                                {{ value }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div
                class="ml-28 2xl:ml-0 col-span-2 flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1 w-full"
                title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
            >
                <h5 class="text-white text-xs">
                    <span class="2xl:hidden">CP</span>
                    <span class="hidden 2xl:inline-block">Codes postaux</span>
                </h5>
                <TagsInput
                    v-model="searchFormData.postalCodeTags"
                    class="flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                >
                    <div
                        :class="[Array.isArray(searchFormData.postalCodeTags) && searchFormData.postalCodeTags.length ? 'w-1/2' : 'hidden']"
                        class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                    >
                        <TagsInputItem
                            v-for="item in searchFormData.postalCodeTags"
                            :key="item"
                            :value="item"
                            class="flex-shrink-0"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="() => removeTag(searchFormData.postalCodeTags, item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        v-model="postalCodeInput"
                        :class="[Array.isArray(searchFormData.postalCodeTags) && searchFormData.postalCodeTags.length ? 'w-1/2' : 'w-full']"
                        class="text-xs flex items-center"
                        placeholder="8793"
                        @blur="handleBlur"
                        @keydown.enter="() => addTag(postalCodeInput, searchFormData.postalCodeTags)"
                    />
                </TagsInput>
            </div>

            <div
                class="ml-24 2xl:ml-0 col-span-2 flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1 w-full"
                title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
            >
                <h5 class="text-white text-xs">
                    <span class="xl:hidden">Ville(s)</span>
                    <span class="hidden xl:inline-block">Ville(s)</span>
                </h5>
                <TagsInput
                    v-model="searchFormData.cityTags"
                    class="flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                >
                    <div
                        :class="[Array.isArray(searchFormData.cityTags) && searchFormData.cityTags.length ? 'w-1/2' : 'hidden']"
                        class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                    >
                        <TagsInputItem
                            v-for="item in searchFormData.cityTags"
                            :key="item"
                            :value="item"
                            class="flex-shrink-0"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="() => removeTag(searchFormData.cityTags, item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        v-model="cityInput"
                        :class="[Array.isArray(searchFormData.cityTags) && searchFormData.cityTags.length ? 'w-1/2' : 'w-full']"
                        class="text-xs flex items-center"
                        placeholder="City38"
                        @blur="handleBlur"
                        @keydown.enter="() => addTag(cityInput, searchFormData.cityTags)"
                    />
                </TagsInput>
            </div>

            <div class="ml-20 2xl:ml-0 col-span-1 flex items-center gap-3 2xl:gap-6 w-full">
                <Button
                    class="bg-primary flex items-center justify-center text-sm h-11 px-4"
                    @click="reinitializeFilter"
                >
                    <ArrowPathIcon class="w-6" />
                    <span class="ml-2 block lg:hidden text-sm">Réinitialiser</span>
                </Button>
                <Button
                    type="submit"
                    class="text-sm bg-primary flex items-center justify-center h-11 px-4"
                >
                    <MagnifyingGlassIcon class="w-6" />
                    <span class="ml-2 text-sm">Rechercher</span>
                </Button>
            </div>
        </form>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-5 overflow-x-hidden gap-2 rounded-t-lg border-none">
                        <TableHead class="col-span-1 bg-primary w-full flex justify-center items-center text-white text-xs">
                            Nom
                        </TableHead>
                        <TableHead class="col-span-1 bg-primary w-full flex justify-center items-center text-white text-xs">
                            Code postal
                        </TableHead>
                        <TableHead class="col-span-1 bg-primary w-full flex justify-center items-center text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="col-span-1 bg-primary w-full flex justify-center items-center text-white text-xs">
                            Durée
                        </TableHead>
                        <TableHead class="col-span-1 bg-primary w-full flex justify-center items-center text-white text-xs">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody class="rounded-b-lg">
                    <div v-if="loading">
                        <TableRow
                            v-for="(_, index) in Array.from({ length: 10 })"
                            :key="index"
                            class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden h-16"
                        >
                            <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                        </TableRow>
                    </div>
                    <div v-else-if="demandPartners.data.length !== 0">
                        <TableRow
                            v-for="partnership in demandPartners.data"
                            :key="partnership.id"
                            class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden relative"
                        >
                            <TableCell class="flex items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <template v-if="!partnership.user.profile.profil_url">
                                        <LayoutsAppImage
                                            src="/icons/user-circle.png"
                                            class="opacity-50 w-6"
                                        />
                                    </template>
                                    <template v-else>
                                        <img
                                            :src="useRuntimeConfig().public.API_URL + '/storage/' + partnership.user.profile.profil_url"
                                            class="w-6 h-6 rounded-full"
                                        >
                                    </template>
                                    <span>
                                        {{ partnership.user.full_name }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span
                                        :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.postalCodeTags.includes(partnership.user.zip_code) })]"
                                    >
                                        {{ partnership.user.zip_code }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span
                                        :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.cityTags.includes(partnership.user.city) })]"
                                    >
                                        {{ partnership.user.city }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span>
                                        {{ durations[partnership.duration] }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <EllipsisHorizontalIcon class="w-6" />
                                </div>
                            </TableCell>
                        </TableRow>
                    </div>
                    <div v-else>
                        <p class="text-center text-gray-500 py-8">
                            Aucun résultat n'est trouvé
                        </p>
                    </div>
                </TableBody>
            </Table>

            <div class="mt-4">
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="demandPartners.total"
                    @update:page="changePage"
                    @update:per-page="changePerPage"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, ArrowPathIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { usePartners } from '@/composables/usePartners';
import { cn } from '@/lib/utils';
import { PERPAGE } from '~/lib/constants';
import { useRuntimeConfig } from '#app';

const perPage = ref(PERPAGE);
const page = ref(1);

const durations = {
    short: 'Court terme',
    long: 'Long terme',
};

const { fetchDemandPartners, demandPartners, loading } = usePartners();

const postalCodeInput = ref('');
const cityInput = ref('');

const searchFormData = reactive({
    duration: '',
    postalCodeTags: [],
    cityTags: [],
    type: '',
});

const isSubmitted = ref(false);

const handleBlur = (event) => {
    const inputEl = event.target;
    const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    });
    inputEl.dispatchEvent(enterEvent);
};

const addTag = (inputRef, tagArrayRef, transformFn = val => val) => {
    const value = transformFn(inputRef.value.trim());
    if (value && !tagArrayRef.value.includes(value)) {
        tagArrayRef.value.push(value);
        inputRef.value = '';
    }
};

const search = async () => {
    page.value = 1;
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        duration: searchFormData.duration,
        page: page.value,
        perPage: perPage.value,
    });
    isSubmitted.value = true;
};

const changePage = async (newPage: number) => {
    page.value = newPage;
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        duration: searchFormData.duration,
        page: page.value,
        perPage: perPage.value,
    });
};

const changePerPage = async (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        duration: searchFormData.duration,
        page: page.value,
        perPage: perPage.value,
    });
};

onMounted(async () => {
    await fetchDemandPartners({
        page: page.value,
        perPage: perPage.value,
    });
});

const removeTag = (tagArrayRef, tagToRemove) => {
    tagArrayRef.value = tagArrayRef.value.filter(tag => tag !== tagToRemove);
};

const reinitializeFilter = async () => {
    searchFormData.duration = '';
    searchFormData.postalCodeTags = [];
    searchFormData.cityTags = [];
    isSubmitted.value = false;
    page.value = 1;
    await fetchDemandPartners({ page: page.value, perPage: perPage.value });
};

useHead({
    title: 'Chercher un partenaire',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
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
