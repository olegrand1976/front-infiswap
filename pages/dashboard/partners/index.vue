<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="py-3 text-primary sm:bg-gray-100 sm:w-[65%] lg:w-[75%] sm:px-9 rounded-lg">
                Chercher <strong>un partenaire</strong>
            </h1>

            <Button
                @click="createPartnerDialog"
            >
                Demander une collaboration
            </Button>
        </div>

        <form class="mt-8 grid grid-cols-7 items-center gap-6 w-full">
            <div class="col-span-1 2xl:col-span-2">
                <Select>
                    <SelectTrigger
                        class="w-64 2xl:w-full"
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
                    <span class="xl:hidden">CP</span>
                    <span class="hidden xl:inline-block">Codes postaux</span>
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
                    <div>
                        <TableRow
                            class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden relative"
                        >
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounhttp://localhost:3000/dashboard/replacements/immediateded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <LayoutsAppImage
                                        src="/icons/user-circle.png"
                                        class="opacity-50 w-6"
                                    />
                                    <span>
                                        John Doe
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span>
                                        9856
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span>
                                        Bruxelles
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                    <span>
                                        Long terme
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
                </TableBody>
            </Table>
        </div>

        <Dialog v-model:open="createPartnerDialog">
            <DialogContent class="sm:max-w-[40rem] h-[70vh] pb-16">
                <DialogHeader>
                    <DialogTitle class="text-xl font-semibold text-primary">
                        Demander une collaboration
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, ArrowPathIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';

const durations = {
    short: 'Court terme',
    long: 'Long terme',
};

const createPartnerDialog = ref(false);

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

watch(() => searchFormData.postalCodeTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(() => searchFormData.cityTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(() => searchFormData.selectedDays, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

const removeTag = (tagArrayRef, tagToRemove) => {
    tagArrayRef.value = tagArrayRef.value.filter(tag => tag !== tagToRemove);
};

const reinitializeFilter = () => {
    searchFormData.duration = '';
    searchFormData.postalCodeTags = [];
    searchFormData.cityTags = [];
    isSubmitted.value = false;
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
