<template>
    <div>
        <div class="flex mt-6">
            <Form class="grid grid-cols-5 w-full gap-4">
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
                                                <TagsInputItemDelete @click="() => removeTag(formData.postalCodeTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="postalCodeInput"
                                            :class="Array.isArray(formData.postalCodeTags) && formData.postalCodeTags.length ? 'w-1/2' : 'w-full'"
                                            class="text-xs flex items-center"
                                            placeholder="8793"
                                            @blur="handleBlur"
                                            @keydown.enter="() => addTag(postalCodeInput, formData.postalCodeTags)"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:col-span-1 lg:-ms-16 lg:w-72">
                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">Ville(s)</span>
                                        <span class="hidden xl:inline-block">Ville(s)</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.cityTags"
                                        class="w-[14rem] flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
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
                                                <TagsInputItemDelete @click="() => removeTag(formData.cityTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="cityInput"
                                            :class="Array.isArray(formData.cityTags) && formData.cityTags.length ? 'w-1/2' : 'w-full'"
                                            class="text-xs flex items-center"
                                            placeholder="City38"
                                            @blur="handleBlur"
                                            @keydown.enter="() => addTag(cityInput, formData.cityTags)"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:col-span-1 flex gap-3">
                    <Button
                        class="bg-primary"
                        @click="reinitializeFilter"
                    >
                        <ArrowPathIcon class="w-6" />
                    </Button>
                    <Button
                        class="text-sm bg-primary"
                        @click="submit"
                    >
                        <MagnifyingGlassIcon class="w-6" />
                        Rechercher
                    </Button>
                </div>
            </Form>
        </div>

        <div class="grid my-8">
            <div class="hidden lg:block">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 rounded-t-lg border-none">
                            <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                                Jour
                            </TableHead>
                            <TableHead class="bg-primary w-full grid grid-cols-3 justify-center items-center text-white text-xs">
                                <div class="text-center">
                                    Matin
                                </div>
                                <div class="text-center">
                                    Midi
                                </div>
                                <div class="text-center">
                                    Soir
                                </div>
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Codes postaux
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Ville(s)
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
                                class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden h-16"
                            >
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            </TableRow>
                        </div>
                        <div v-else-if="filteredReplacements.length === 0">
                            <p class="text-center text-gray-500 py-8">
                                Aucun résultat n'est trouvé
                            </p>
                        </div>
                        <div v-else>
                            <TableRow
                                v-for="replacement in filteredReplacements"
                                :key="replacement.id"
                                class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden relative"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement)"
                                    class="urgent-indicator"
                                >
                                    URGENT
                                </div>

                                <TableCell class="flex justify-center items-center bg-[#F1F2F7] xl:text-[0.75em] lg:text-[0.5em]">
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.start_date) }}</span>
                                    </div>
                                    <span class="flex items-center">au</span>
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.end_date) }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs grid grid-cols-3 place-items-center">
                                    <div>
                                        <span v-if="hasShift(replacement, 'morning')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'afternoon')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'evening')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                            :key="index"
                                                            :class="cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })"
                                                        >
                                                            {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                        :key="index"
                                                        :class="cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })"
                                                    >
                                                        {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate w-full h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(city, index) in JSON.parse(replacement.cities)"
                                                            :key="index"
                                                            :class="cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })"
                                                        >
                                                            {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(city, index) in JSON.parse(replacement.cities)"
                                                        :key="index"
                                                        :class="cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })"
                                                    >
                                                        {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-gray-100 text-xs pt-5">
                                    <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell
                                    class="text-xs flex items-center justify-center bg-[#F1F2F7] overflow-x-hidden pt-4"
                                >
                                    <Button
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                        :href="`/dashboard/replacements/detail/${replacement.id}`"
                                    >
                                        <EyeIcon class="h-6 mt-1" />
                                    </Button>
                                    <Button
                                        v-if="user.nurse.id == replacement.nurse_id"
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                        @click="closeReplacementDialog = true"
                                    >
                                        <XMarkIcon class="h-6 mt-1" />
                                    </Button>

                                    <Dialog v-model:open="closeReplacementDialog">
                                        <DialogContent class="sm:max-w-lg overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Fermer le remplacement
                                                </DialogTitle>
                                                <DialogDescription class="mt-3 mb-6">
                                                    Etes-vous sur de vouloir fermer ce remplacement ?
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300 px-8"
                                                    @click="closeReplacementDialog = false"
                                                >
                                                    Non
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    class="px-8"
                                                    @click="handleCloseReplacement(replacement)"
                                                >
                                                    Oui
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        </div>
                    </TableBody>
                </Table>
            </div>

            <div class="lg:hidden">
                <div v-if="loading && loadingSearch">
                    <div
                        v-for="(_, index) in Array.from({ length: 3 })"
                        :key="index"
                        class="grid grid-cols-1"
                    >
                        <Skeleton class="h-32 w-full bg-gray-100" />
                    </div>
                </div>
                <div v-else-if="filteredReplacements.length === 0">
                    <p class="text-center text-gray-500 py-8">
                        Aucun résultat n'est trouvé
                    </p>
                </div>
                <div
                    v-for="replacement in filteredReplacements"
                    v-else
                    :key="replacement?.id"
                    class="grid grid-cols-2 gap-4 rounded bg-gray-100 mb-12 relative"
                >
                    <div
                        v-if="isUrgentReplacement(replacement)"
                        class="urgent-indicator mt-9"
                    >
                        URGENT
                    </div>

                    <div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Jour
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <span class="py-1 px-3 bg-gray-300">{{ formatDate(replacement.start_date) }}</span>
                                <span>   au   </span>
                                <span class="py-1 px-3 bg-gray-300">{{ formatDate(replacement.end_date) }}</span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="grid grid-cols-3 bg-primary text-white py-2 rounded-md">
                                <span class="text-center text-sm">Matin</span>
                                <span class="text-center text-sm">Après-midi</span>
                                <span class="text-center text-sm">Soir</span>
                            </div>
                            <div class="grid grid-cols-3 py-2">
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'morning')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'afternoon')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'evening')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Codes postaux
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-2 text-center truncate">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                        :key="index"
                                                        :class="cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })"
                                                    >
                                                        {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                    </span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                    :key="index"
                                                    :class="cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })"
                                                >
                                                    {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Ville(s)
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-2 text-center truncate w-full">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(city, index) in JSON.parse(replacement.cities)"
                                                        :key="index"
                                                        :class="cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })"
                                                    >
                                                        {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                    </span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(city, index) in JSON.parse(replacement.cities)"
                                                    :key="index"
                                                    :class="cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })"
                                                >
                                                    {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <h4 class="bg-primary text-white py-2 text-center rounded">
                            Type(s) de soin(s)
                        </h4>
                        <div class="mt-3 py-3 bg-gray-200 text-center rounded">
                            <p class="truncate w-full px-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </p>
                        </div>
                    </div>

                    <div class="col-span-2 mt-4 flex space-x-8 justify-center items-center mx-auto">
                        <Button
                            v-if="user.nurse.id == replacement.nurse_id"
                            variant="secondary"
                            class="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-black text-base"
                            @click="closeReplacementDialog = true"
                        >
                            Fermer
                        </Button>
                        <Button
                            class="py-2 px-6"
                            :href="`/dashboard/replacements/detail/${replacement.id}`"
                        >
                            Voir plus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, CheckCircleIcon, EyeIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input';
import { useReplacements, useSearchReplacements } from '~/composables/useReplacements';
import { cn } from '@/lib/utils';
import { selectDays, getPeriodsFromTimeSlot } from '~/lib/utils';

const { $toast } = useNuxtApp();

const props = defineProps({
    type: {
        type: String,
        required: false,
        default: '',
    },
    getData: {
        type: Function,
        required: true,
    },
    filterType: {
        type: String,
        required: false,
        default: 'all',
    },
});

const { loading, updateReplacement } = useReplacements();
const { loadingSearch, fetchReplacements } = useSearchReplacements();

onMounted(async () => {
    await fetchInitialData();
});

const user = useState('user');
const settings = JSON.parse(user.value.settings);
const postalCodeInput = ref('');
const cityInput = ref('');

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const normalizeTime = (time) => {
    if (!time) return null;
    return time.split(':').slice(0, 2).join(':');
};

const hasShift = (replacement, period) => {
    const periods = new Set();

    const timeSlotRaw = replacement.time_slot || replacement.timeSlot;
    if (timeSlotRaw) {
        const timeSlot = typeof timeSlotRaw === 'string' ? JSON.parse(timeSlotRaw) : timeSlotRaw;
        if (timeSlot.start_at) {
            const startAt = normalizeTime(timeSlot.start_at);
            const endAt = normalizeTime(timeSlot.end_at);

            const timeSlotPeriods = getPeriodsFromTimeSlot(startAt, endAt);
            timeSlotPeriods.forEach(p => periods.add(p));
        }
    }

    if (replacement.details && Array.isArray(replacement.details)) {
        replacement.details.forEach((detail) => {
            if (detail.start_at) {
                const startAt = normalizeTime(detail.start_at);
                const endAt = normalizeTime(detail.end_at);

                const detailPeriods = getPeriodsFromTimeSlot(startAt, endAt);
                detailPeriods.forEach(p => periods.add(p));
            }
        });
    }

    return periods.has(period);
};

const isUrgentReplacement = (replacement) => {
    return !replacement.time_slot && replacement.details.length != 0;
};

const isReplacementActive = (replacement) => {
    const currentDate = new Date();
    const endDate = new Date(replacement.end_date);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    if (endYear > currentYear) return true;
    if (endYear < currentYear) return false;
    if (endMonth > currentMonth) return true;
    if (endMonth < currentMonth) return false;
    return endDay >= currentDay;
};

const filteredReplacements = computed(() => {
    return currentReplacements.value.filter(
        replacement => replacement.status === 'open'
            && isReplacementActive(replacement)
            && (props.filterType === 'all' || (props.filterType === 'urgent') === isUrgentReplacement(replacement)),
    );
});

const formData = reactive({
    postalCodeTags: settings.replacement.zip_codes || [],
    cityTags: settings.replacement.cities || [],
    selectedDays: [],
    type: props.type,
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
    all: 'Tous',
};

const toggleDay = (day: string) => {
    formData.selectedDays = selectDays(day, formData.selectedDays);
};

const selectedDaysPlaceholder = computed(() => {
    if (formData.selectedDays.length === 0) {
        return 'Sélectionner';
    }
    return formData.selectedDays.map(day => frenchDays[day]).join(', ');
});

const sortReplacements = (replacements) => {
    return replacements.sort((a, b) => {
        const aIsUrgent = isUrgentReplacement(a);
        const bIsUrgent = isUrgentReplacement(b);

        if (aIsUrgent && !bIsUrgent) return -1;
        if (!aIsUrgent && bIsUrgent) return 1;

        const aMatches = a.details.some(
            detail => formData.postalCodeTags.includes(detail.patient?.zip_code?.toString()?.trim())
                || formData.cityTags.includes(detail.patient?.city?.toLowerCase()?.trim()),
        );

        const bMatches = b.details.some(
            detail => formData.postalCodeTags.includes(detail.patient?.zip_code?.toString()?.trim())
                || formData.cityTags.includes(detail.patient?.city?.toLowerCase()?.trim()),
        );

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;

        const dateA = new Date(a.start_date).getTime() || 0;
        const dateB = new Date(b.start_date).getTime() || 0;

        return dateB - dateA;
    });
};

const initialReplacements = ref([]);
const currentReplacements = ref([]);

const fetchInitialData = async () => {
    const data = await props.getData();
    initialReplacements.value = data;
    currentReplacements.value = sortReplacements(data.data);
};

const isSubmitted = ref(false);

const isZipCodeHighlighted = (zipCode) => {
    if (!isSubmitted.value) return false;
    return formData.postalCodeTags.includes(zipCode.toString().trim());
};

const getUniqueValues = (details, extractor, transformer = x => x) => {
    const values = details
        .flatMap(detail => extractor(detail) || [])
        .map(transformer)
        .filter(value => value);

    return [...new Set(values)];
};

const hasMatchingCityFromUnique = (city) => {
    if (!isSubmitted.value) return false;

    const normalizedCity = city.toLowerCase().trim();
    return formData.cityTags.some(tag => tag.toLowerCase() === normalizedCity)
        || formData.cityTags.some(tag => tag.toLowerCase().includes(normalizedCity));
};

const addTag = (inputRef, tagArrayRef, transformFn = val => val) => {
    const value = transformFn(inputRef.value.trim());
    if (value && !tagArrayRef.value.includes(value)) {
        tagArrayRef.value.push(value);
        inputRef.value = '';
    }
};

const removeTag = (tagArrayRef, tagToRemove) => {
    tagArrayRef.value = tagArrayRef.value.filter(tag => tag !== tagToRemove);
};

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

const submit = async () => {
    isSubmitted.value = true;

    const hasSearchCriteria = formData.selectedDays.length > 0
        || formData.postalCodeTags.length > 0
        || formData.cityTags.length > 0;

    if (hasSearchCriteria) {
        const response = await fetchReplacements({
            selectedDays: Array.from(formData.selectedDays),
            postalCode: toRaw(formData.postalCodeTags),
            cities: toRaw(formData.cityTags),
            type: toRaw(formData.type),
        });

        currentReplacements.value = sortReplacements(response.replacements.data);
    }
    else {
        currentReplacements.value = sortReplacements(initialReplacements.value.data);
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
            currentReplacements.value = sortReplacements(initialReplacements.value.data);
            isSubmitted.value = false;
        }
        else if (isSubmitted.value) {
            submit();
        }
    },
    { deep: true },
);

const closeReplacementDialog = ref(false);

const handleCloseReplacement = async (replacement) => {
    replacement.status = 'closed';
    const response = await updateReplacement(replacement);

    if (response) {
        $toast({
            description: response.message,
        });

        currentReplacements.value = currentReplacements.value.filter(r => r.id !== replacement.id);
        closeReplacementDialog.value = false;
    }
};

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
